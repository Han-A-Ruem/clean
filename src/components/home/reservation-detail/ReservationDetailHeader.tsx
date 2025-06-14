
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Car, Play, Check, X, Calendar } from "lucide-react";
import { ReservationData } from "@/types/reservation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/hooks/useNotification";

interface ReservationDetailHeaderProps {
  reservation: ReservationData | null;
  isSameDay: boolean;
  isLate: boolean;
  setIsLate: (isLate: boolean) => void;
  setShowRescheduleDialog: (show: boolean) => void;
  setShowCancellationDialog: (show: boolean) => void;
  setShowLateStartCleaningDialog: (show: boolean) => void;
  updateCleaningStatus: () => Promise<void>;
}

const ReservationDetailHeader = ({
  reservation,
  isSameDay,
  isLate,
  setIsLate,
  setShowRescheduleDialog,
  setShowCancellationDialog,
  setShowLateStartCleaningDialog,
  updateCleaningStatus
}: ReservationDetailHeaderProps) => {
  const { toast } = useToast();
  const { createNotification } = useNotification();
  const [taskStarted, setTaskStarted] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(reservation?.status);

  // This effect updates local state when reservation status changes
  useEffect(() => {
    setCurrentStatus(reservation?.status);
    setTaskStarted(
      reservation?.status === 'on_the_way' || 
      reservation?.status === 'cleaning' || 
      reservation?.status === 'completed'
    );
  }, [reservation?.status]);

  const handleTaskStart = async () => {
    try {
      if (!reservation?.id) return;

      setTaskStarted(true);

      if (isSameDay) {
        setIsLate(true);
        const { error } = await supabase
          .from('reservations')
          .update({ is_late: true })
          .eq('id', reservation.id);

        if (error) {
          console.error('Error updating late status:', error);
          toast({
            variant: "destructive",
            title: "상태 업데이트 실패",
            description: "지각 상태를 업데이트하지 못했습니다.",
          });
        }
      }

      toast({
        title: "업무가 시작되었습니다",
        description: "성공적으로 업무를 시작했습니다.",
      });
    } catch (err) {
      console.error('Error starting task:', err);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "업무 시작 중 문제가 발생했습니다.",
      });
    }
  };

  const handleDeparture = async () => {
    try {
      if (!reservation?.id) return;
      
      // Update the status in the Supabase database
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'on_the_way' })
        .eq('id', reservation.id);
        
      if (error) {
        console.error('Error updating departure status:', error);
        toast({
          variant: "destructive",
          title: "상태 업데이트 실패",
          description: "출발 상태를 업데이트하지 못했습니다.",
        });
        return;
      }
      
      // Update local state immediately
      setCurrentStatus('on_the_way');
      setTaskStarted(true);
      
      // Create notification for the user
      if (reservation.user) {
        await createNotification({
          userId: reservation.user,
          title: "청소 담당자가 출발했습니다",
          message: "청소 담당자가 현재 이동 중입니다. 곧 도착할 예정입니다.",
          type: "system",
          action_url: `/bookings/${reservation.id}`
        });
      }
      
      toast({
        title: "출발했습니다",
        description: "고객님 댁으로 이동 중입니다.",
      });
    } catch (err) {
      console.error('Error updating departure status:', err);
      toast({
        variant: "destructive",
        title: "상태 업데이트 실패",
        description: "출발 상태를 업데이트하지 못했습니다.",
      });
    }
  };

  const handleStartCleaning = async () => {
    try {
      if (!reservation?.id) return;
      
      if (reservation?.is_late) {
        setShowLateStartCleaningDialog(true);
        return;
      }
      
      await updateCleaningStatus();
      
      // Create notification for the user
      if (reservation.user) {
        await createNotification({
          userId: reservation.user,
          title: "청소가 시작되었습니다",
          message: "청소 담당자가 청소를 시작했습니다.",
          type: "system",
          action_url: `/bookings/${reservation.id}`
        });
      }
      
    } catch (err) {
      console.error('Error updating cleaning status:', err);
      toast({
        variant: "destructive",
        title: "상태 업데이트 실패",
        description: "청소 상태를 업데이트하지 못했습니다.",
      });
    }
  };

  const handleCompleteCleaning = async () => {
    try {
      if (!reservation?.id) return;
      
      // Update the status in the Supabase database
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservation.id);
        
      if (error) {
        console.error('Error updating completion status:', error);
        toast({
          variant: "destructive",
          title: "상태 업데이트 실패",
          description: "완료 상태를 업데이트하지 못했습니다.",
        });
        return;
      }
      
      // Update local state immediately
      setCurrentStatus('completed');
      
      // Create notification for the user
      if (reservation.user) {
        await createNotification({
          userId: reservation.user,
          title: "청소가 완료되었습니다",
          message: "청소 담당자가 청소를 완료했습니다. 리뷰를 작성해주세요.",
          type: "system",
          action_url: `/bookings/${reservation.id}`
        });
      }
      
      toast({
        title: "청소가 완료되었습니다",
        description: "성공적으로 청소를 마쳤습니다.",
      });
    } catch (err) {
      console.error('Error updating completion status:', err);
      toast({
        variant: "destructive",
        title: "상태 업데이트 실패",
        description: "완료 상태를 업데이트하지 못했습니다.",
      });
    }
  };

  // Determine button visibility based on current status
  const showDepartButton = currentStatus === 'pending';
  const showStartCleaningButton = currentStatus === 'on_the_way';
  const showCompleteButton = currentStatus === 'cleaning';
  const isCompleted = currentStatus === 'completed';
  const isCancelled = currentStatus === 'cancelled';
  const canManageReservation = currentStatus !== 'completed' && currentStatus !== 'cancelled';

  return (
    <div className="pt-4">
      <h1 className="text-2xl mb-2 px-4">업무시작을 눌러주세요.</h1>
      <p className="text-gray-500 mb-4 px-4">시작을 알립니다.</p>

      <div className="px-4 py-4 mb-4 sticky top-0 z-20 bg-gray-100">
        <div className="grid grid-cols-1 gap-3">
          {showDepartButton && (
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-full text-lg"
              onClick={handleDeparture}
            >
              <Car className="w-5 h-5 mr-2" />
              출발하기
            </Button>
          )}
          
          {showStartCleaningButton && (
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-6 rounded-full text-lg"
              onClick={handleStartCleaning}
            >
              <Play className="w-5 h-5 mr-2" />
              청소 시작
            </Button>
          )}
          
          {showCompleteButton && (
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-full text-lg"
              onClick={handleCompleteCleaning}
            >
              <Check className="w-5 h-5 mr-2" />
              청소 완료
            </Button>
          )}
          
          {isCompleted && (
            <Button
              className="w-full bg-green-700 text-white py-6 rounded-full text-lg"
              disabled
            >
              <Check className="w-5 h-5 mr-2" />
              완료됨
            </Button>
          )}
          
          {isCancelled && (
            <Button
              className="w-full bg-red-700 text-white py-6 rounded-full text-lg"
              disabled
            >
              <X className="w-5 h-5 mr-2" />
              취소됨
            </Button>
          )}
          
          {canManageReservation && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                variant="outline"
                className="flex items-center justify-center"
                onClick={() => setShowRescheduleDialog(true)}
              >
                <Calendar className="w-4 h-4 mr-2" />
                일정 변경
              </Button>
              <Button
                variant="destructive"
                className="flex items-center justify-center"
                onClick={() => setShowCancellationDialog(true)}
              >
                <X className="w-4 h-4 mr-2" />
                예약 취소
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailHeader;
