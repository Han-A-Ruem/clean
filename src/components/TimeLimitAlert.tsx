
import React from 'react';
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TimeLimitAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTime: string;
  serviceHours: number;
}

const TimeLimitAlert: React.FC<TimeLimitAlertProps> = ({
  open,
  onOpenChange,
  selectedTime,
  serviceHours,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            시간 제한 알림
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
          선택하신 시간({selectedTime})에 {serviceHours}시간 서비스를 진행하면 16:00을 초과합니다. 서비스는 16:00까지 가능합니다. 다른 시간을 선택해 주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TimeLimitAlert;
