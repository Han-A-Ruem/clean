
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { PromotionPopup } from "@/types/promotion";
import PromotionPopupForm from "./PromotionPopupForm";

const PromotionPopupManagement = () => {
  const [popups, setPopups] = useState<PromotionPopup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPopup, setSelectedPopup] = useState<PromotionPopup | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchPopups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('promotion_popups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPopups(data || []);
    } catch (error: any) {
      console.error('Error fetching promotion popups:', error);
      toast.error('프로모션 팝업 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleAddClick = () => {
    setSelectedPopup(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEditClick = (popup: PromotionPopup) => {
    setSelectedPopup(popup);
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeleteClick = (popup: PromotionPopup) => {
    setSelectedPopup(popup);
    setDeleteDialogOpen(true);
  };

  const deletePopup = async () => {
    if (!selectedPopup) return;
    
    try {
      const { error } = await supabase
        .from('promotion_popups')
        .delete()
        .eq('id', selectedPopup.id);

      if (error) throw error;
      
      toast.success('프로모션 팝업이 삭제되었습니다.');
      fetchPopups();
    } catch (error: any) {
      console.error('Error deleting promotion popup:', error);
      toast.error('프로모션 팝업 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedPopup(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '무기한';
    return format(new Date(dateString), 'yyyy-MM-dd');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">프로모션 팝업 관리</h3>
        <Button onClick={handleAddClick} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>팝업 추가</span>
        </Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>설명</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                </TableRow>
              ))
            ) : popups.length > 0 ? (
              popups.map((popup) => (
                <TableRow key={popup.id}>
                  <TableCell className="font-medium">{popup.title}</TableCell>
                  <TableCell className="max-w-[250px] truncate">{popup.description}</TableCell>
                  <TableCell>{formatDate(popup.start_date)}</TableCell>
                  <TableCell>{formatDate(popup.end_date)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      popup.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {popup.is_active ? '활성' : '비활성'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {popup.target_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(popup.target_url, '_blank')}
                          title="링크 열기"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(popup)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClick(popup)}
                        className="text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  등록된 프로모션 팝업이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? '프로모션 팝업 수정' : '새 프로모션 팝업 추가'}</DialogTitle>
          </DialogHeader>
          <PromotionPopupForm 
            popup={selectedPopup} 
            onComplete={() => {
              setFormOpen(false);
              fetchPopups();
            }} 
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로모션 팝업 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              "{selectedPopup?.title}" 팝업을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={deletePopup} className="bg-red-500 hover:bg-red-600">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PromotionPopupManagement;
