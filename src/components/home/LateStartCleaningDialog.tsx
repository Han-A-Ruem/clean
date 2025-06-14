
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatters";

interface LateStartCleaningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string | null;
  phoneNumber: number | null;
  onConfirm: () => void;
}

export default function LateStartCleaningDialog({
  open,
  onOpenChange,
  customerName,
  phoneNumber,
  onConfirm,
}: LateStartCleaningDialogProps) {
  const handleCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleContinue = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">지각 고객 연락</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="text-sm text-amber-700">
              지각으로 인해 청소 시간이 단축되었습니다. 청소를 시작하기 전에 고객님께 연락하여 상황을 설명해 주세요.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <p className="font-medium text-blue-800">고객 정보</p>
            <p className="text-sm text-blue-700 mt-1">
              {customerName || "고객"}님: {phoneNumber ? formatPhoneNumber(phoneNumber) : "연락처 없음"}
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            onClick={handleCall} 
            disabled={!phoneNumber}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            고객에게 전화하기
          </Button>
          <Button 
            variant="outline" 
            onClick={handleContinue} 
            className="w-full sm:w-auto"
          >
            청소 시작하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
