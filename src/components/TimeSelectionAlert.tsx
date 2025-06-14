
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

interface TimeSelectionAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  areaThreshold: number | null | undefined;
}

const TimeSelectionAlert: React.FC<TimeSelectionAlertProps> = ({
  open,
  onOpenChange,
  areaThreshold,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            시간 선택 알림
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-2">
            {areaThreshold && areaThreshold >= 30 
              ? `면적이 ${areaThreshold}㎡인 공간은 최소 4시간 이상의 서비스가 필요합니다.`
              : '선택하신 서비스 시간은 적용할 수 없습니다. 다른 시간을 선택해 주세요.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TimeSelectionAlert;
