
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  deleteMode: "soft" | "hard" | "activate";
  itemTitle: string;
  onConfirm: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  isLoading,
  deleteMode,
  itemTitle,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deleteMode === "soft" 
              ? "상품 비활성화" 
              : deleteMode === "activate" 
                ? "상품 활성화" 
                : "상품 삭제"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleteMode === "soft" ? (
              <>
                <span className="font-semibold">{itemTitle}</span> 상품을 
                비활성화 하시겠습니까? 비활성화된 상품은 사용자에게 보이지 않지만,
                나중에 다시 활성화할 수 있습니다.
              </>
            ) : deleteMode === "activate" ? (
              <>
                <span className="font-semibold text-green-500">{itemTitle}</span> 상품을
                활성화 하시겠습니까? 활성화된 상품은 사용자에게 보이게 됩니다.
              </>
            ) : (
              <>
                <span className="font-semibold text-red-500">{itemTitle}</span> 상품을
                영구적으로 삭제하시겠습니까? 이 작업은 취소할 수 없으며, 연결된 모든 데이터가
                함께 삭제됩니다.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
          <Button
            variant={deleteMode === "hard" ? "destructive" : deleteMode === "activate" ? "outline" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
            className={deleteMode === "activate" ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700" : ""}
          >
            {isLoading
              ? "처리 중..."
              : deleteMode === "soft"
              ? "비활성화"
              : deleteMode === "activate"
              ? "활성화"
              : "삭제"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
