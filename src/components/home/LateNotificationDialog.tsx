
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { formatPhoneNumber } from "@/utils/formatters";

interface LateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string | null;
  phoneNumber: number | null;
  delayTime: number; // in minutes
}

export default function LateNotificationDialog({
  open,
  onOpenChange,
  customerName,
  phoneNumber,
  delayTime,
}: LateNotificationDialogProps) {
  // Format delay time to display in hours and minutes
  const formatDelayTime = () => {
    if (delayTime < 60) {
      return `${delayTime}분`;
    }
    const hours = Math.floor(delayTime / 60);
    const minutes = delayTime % 60;
    return `${hours}시간 ${minutes > 0 ? `${minutes}분` : ''}`;
  };
  
  const handleCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl">지각 알림</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
            <p className="font-medium text-amber-800">예상 지연 시간: {formatDelayTime()}</p>
            <p className="text-sm text-amber-700 mt-1">
              지연된 시간만큼 청소 시간에서 차감됩니다. 고객님께 불편을 드리지 않도록 직접 연락해 주세요.
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            나중에 연락
          </Button>
          <Button 
            variant="default" 
            onClick={handleCall} 
            disabled={!phoneNumber}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            지금 전화하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
