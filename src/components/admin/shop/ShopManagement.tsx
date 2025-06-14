
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, EyeOff, Eye } from "lucide-react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ShopItemModal from "./ShopItemModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { shopItemService, ShopItemType } from "@/services/shopItemService";

const ShopManagement: React.FC = () => {
  const [items, setItems] = useState<ShopItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShopItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMode, setDeleteMode] = useState<"soft" | "hard" | "activate">("soft");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const allItems = await shopItemService.getAllShopItems();
      setItems(allItems);
    } catch (error) {
      console.error("Error loading shop items:", error);
      toast.error("항목을 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: ShopItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: ShopItemType, mode: "soft" | "hard" | "activate") => {
    setSelectedItem(item);
    setDeleteMode(mode);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    setIsDeleting(true);
    try {
      let success = false;
      
      if (deleteMode === "soft") {
        success = await shopItemService.softDeleteShopItem(selectedItem.id);
        if (success) {
          toast.success("항목이 비활성화되었습니다");
        }
      } else if (deleteMode === "hard") {
        success = await shopItemService.deleteShopItem(selectedItem.id);
        if (success) {
          toast.success("항목이 삭제되었습니다");
        }
      } else if (deleteMode === "activate") {
        success = await shopItemService.activateShopItem(selectedItem.id);
        if (success) {
          toast.success("항목이 활성화되었습니다");
        }
      }
      
      if (success) {
        await loadItems();
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating item status:", error);
      toast.error("항목 상태 변경 중 오류가 발생했습니다");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveItem = async () => {
    await loadItems();
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">상품 관리</h2>
        <Button onClick={handleAddItem} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          새 상품 추가
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>데이터를 불러오는 중...</p>
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>상태</TableHead>
                <TableHead>이미지</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>가격</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    등록된, 상품이 없습니다
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className={!item.is_active ? "bg-gray-50" : ""}>
                    <TableCell>
                      {item.is_active ? (
                        <span className="text-green-500 font-medium">활성화</span>
                      ) : (
                        <span className="text-gray-400 font-medium">비활성화</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        {item.img_url ? (
                          <img 
                            src={item.img_url} 
                            alt={item.title} 
                            className="w-10 h-10 object-contain"
                          />
                        ) : item.icon_name ? (
                          <div className="text-primary">
                            {item.image}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No image</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={!item.is_active ? "text-gray-400" : ""}>
                      {item.title}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditItem(item)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        수정
                      </Button>
                      {item.is_active ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteClick(item, "soft")}
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          비활성화
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteClick(item, "activate")}
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            활성화
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteClick(item, "hard")}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            삭제
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <ShopItemModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        onSave={handleSaveItem}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        isLoading={isDeleting}
        deleteMode={deleteMode}
        itemTitle={selectedItem?.title || ""}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ShopManagement;
