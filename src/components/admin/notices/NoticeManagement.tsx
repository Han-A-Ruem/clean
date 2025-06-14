
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNotices, Notice } from "@/hooks/useNotices";
import NoticeModal from "./NoticeModal";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";

const NoticeManagement = () => {
  const { notices, isLoading, fetchNotices, createNotice, updateNotice, deleteNotice } = useNotices();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNotice, setCurrentNotice] = useState<Notice | null>(null);
  
  const handleCreateNotice = () => {
    setCurrentNotice(null);
    setModalOpen(true);
  };
  
  const handleEditNotice = (notice: Notice) => {
    setCurrentNotice(notice);
    setModalOpen(true);
  };
  
  const handleDeleteNotice = async (id: string) => {
    if (window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        toast.success("공지사항이 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting notice:", error);
        toast.error("공지사항 삭제 중 오류가 발생했습니다.");
      }
    }
  };
  
  const handleSaveNotice = async (notice: Omit<Notice, 'id'> | Partial<Notice> & { id: string }) => {
    try {
      if ('id' in notice) {
        await updateNotice(notice.id, notice);
        toast.success("공지사항이 업데이트되었습니다.");
      } else {
        await createNotice(notice);
        toast.success("새 공지사항이 생성되었습니다.");
      }
      
      setModalOpen(false);
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      toast.error("공지사항 저장 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Button 
          onClick={handleCreateNotice}
          className="flex items-center gap-2"
        >
          새 공지사항
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6 text-center">로딩 중...</div>
        ) : notices.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            공지사항이 없습니다. 첫 번째 공지사항을 작성해보세요.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>부제목</TableHead>
                <TableHead>날짜</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell>{notice.subtitle}</TableCell>
                  <TableCell>{notice.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNotice(notice)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNotice(notice.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <NoticeModal 
        open={modalOpen}
        onOpenChange={setModalOpen}
        notice={currentNotice}
        onSave={handleSaveNotice}
      />
    </div>
  );
};

export default NoticeManagement;
