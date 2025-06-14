
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface CancellationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => Promise<void>;
  isSameDay?: boolean;
  remainingCancellations?: number;
}

export default function CancellationDialog({
  open,
  onOpenChange,
  onConfirm,
  isSameDay = false,
  remainingCancellations,
}: CancellationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(reason);
      onOpenChange(false);
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">예약 취소</DialogTitle>
          <DialogDescription>
            예약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>

        {isSameDay && (
          <div className="bg-yellow-50 p-3 rounded-md flex items-start gap-2 my-2 border border-yellow-200">
            <AlertTriangle className="text-yellow-500 w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-medium">당일 취소 안내</p>
              <p>당일 취소는 패널티가 부과될 수 있습니다.</p>
            </div>
          </div>
        )}

        {remainingCancellations !== undefined && (
          <div className="text-sm text-gray-500 my-2">
            이번 달 남은 취소 가능 횟수: <span className="font-medium">{remainingCancellations}회</span>
          </div>
        )}

        <div className="py-4">
          <Label htmlFor="cancellation-reason" className="text-sm font-medium">
            취소 사유
          </Label>
          <Input
            id="cancellation-reason"
            placeholder="취소 사유를 입력해주세요"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            아니오
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "예, 취소합니다"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
