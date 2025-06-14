
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Reservation } from "@/types/reservation";
import StatusBadge from "./StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import RescheduleDialog from "./RescheduleDialog";
import CancellationDialog from "./CancellationDialog";
import CancellationPolicy from "./CancellationPolicy";
import { format, isToday, parseISO } from "date-fns";
import { canModifyBooking, getServiceType } from "./utils/bookingUtils";
import BookingInfoSection from "./BookingInfoSection";
import BookingAdditionalDetails from "./BookingAdditionalDetails";
import BookingActionButtons from "./BookingActionButtons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { PageHeader } from "../Utils";

interface BookingDetailProps {
  booking: Reservation | null;
  onBack: () => void;
}

const BookingDetail: React.FC<BookingDetailProps> = ({ booking, onBack }) => {
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [isSameDay, setIsSameDay] = useState(false);
  const [remainingCancellations, setRemainingCancellations] = useState(3);
  const { toast } = useToast();
  const { user, userData } = useUser();

  useEffect(() => {
    // Check if booking is for today
    if (booking?.date) {
      const bookingDate = Array.isArray(booking.date) ? booking.date[0] : booking.date;
      try {
        const dateObj = parseISO(bookingDate);
        setIsSameDay(isToday(dateObj));
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }

    // Get user's remaining cancellations
    if (userData?.monthly_cancellation_limit !== undefined && 
        userData?.monthly_cancellations !== undefined) {
      const remaining = Math.max(0, 
        (userData.monthly_cancellation_limit as number) - 
        (userData.monthly_cancellations as number));
      setRemainingCancellations(remaining);
    }
  }, [booking, userData]);

  if (!booking) {
    return (
      <div className="p-6 text-center">
        <p>예약 정보를 불러올 수 없습니다.</p>
        <button 
          onClick={onBack} 
          className="mt-4 text-primary"
        >
          돌아가기
        </button>
      </div>
    );
  }

  // Handle reschedule
  const handleReschedule = async (newDates: Date[], newTime: string) => {
    try {
      if (!canModifyBooking(booking)) {
        toast({
          title: "일정 변경 불가",
          description: "예약 전날 오후 5시 이후에는 일정을 변경할 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      const formattedDates = newDates.map(date => format(date, "yyyy-MM-dd"));
      // Convert the array of date strings for the database
      const dateArray = formattedDates;
      
      // Update the reservation in the database
      const { error } = await supabase
        .from('reservations')
        .update({ 
          date: dateArray,
          time: newTime
        })
        .eq('id', booking.id);

      if (error) {
        throw error;
      }

      // Notify the assigned cleaner if there is one
      if (booking.cleaner_id) {
        // In a real app, you would send a notification to the cleaner
        console.log(`Notification sent to cleaner ${booking.cleaner_id} about rescheduling`);
      }

      // Show success message
      toast({
        title: "일정이 변경되었습니다",
        description: `새로운 일정: ${formattedDates} ${newTime}`,
      });

      // Force refresh the booking data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      toast({
        title: "일정 변경 실패",
        description: "예약 일정을 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // Handle cancellation with reason
  const handleCancellation = async (reason: string) => {
    try {
      if (!canModifyBooking(booking)) {
        toast({
          title: "예약 취소 불가",
          description: "예약 전날 오후 5시 이후에는 예약을 취소할 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      // Check if user has reached their monthly cancellation limit
      if (remainingCancellations <= 0) {
        toast({
          title: "월간 취소 한도 초과",
          description: "이번 달 취소 가능 횟수를 모두 사용하셨습니다.",
          variant: "destructive",
        });
        return;
      }

      // Update the reservation status to cancelled and add cancellation reason
      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: 'cancelled',
          cancellation_reason: reason 
        })
        .eq('id', booking.id);

      if (error) {
        throw error;
      }

      // Increment the user's monthly cancellations count
      if (user) {
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ 
            monthly_cancellations: (userData?.monthly_cancellations || 0) + 1 
          })
          .eq('user_id', user.id);
          
        if (userUpdateError) {
          console.error("Error updating user's cancellation count:", userUpdateError);
        }
      }

      // Notify the assigned cleaner if there is one
      if (booking.cleaner_id) {
        // In a real app, you would send a notification to the cleaner
        console.log(`Notification sent to cleaner ${booking.cleaner_id} about cancellation`);
      }

      // Show success message
      toast({
        title: "예약이 취소되었습니다",
        description: "예약이 성공적으로 취소되었습니다.",
      });

      // Go back to the bookings list
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "예약 취소 실패",
        description: "예약을 취소하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  const showActionButtons = booking.status !== 'cancelled' && booking.status !== 'completed';
  
  return (
<div>
  <PageHeader title="예약 상"/>
    <div className="bg-background md:p-6 max-w-3xl mx-auto pt-4 px-4">
      <Card className="mb-6 shadow-sm border border-border/50 overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-lg flex items-center">
              {getServiceType(booking.type)}
            </h3>
            <StatusBadge status={booking.status} date={booking.date} />
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Booking Information Section */}
          <BookingInfoSection 
            booking={booking} 
            onShowCancellationPolicy={() => setShowCancellationPolicy(true)} 
          />
          
          {/* Additional Details Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium text-base mb-4">추가 정보</h3>
            <BookingAdditionalDetails booking={booking} />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <BookingActionButtons 
        showButtons={showActionButtons}
        onReschedule={() => setShowRescheduleDialog(true)}
        onCancel={() => setShowCancellationDialog(true)}
      />
      
      {/* Dialogs */}
      <CancellationPolicy 
        open={showCancellationPolicy} 
        onOpenChange={setShowCancellationPolicy} 
      />

      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        onReschedule={handleReschedule}
        currentDate={booking.date}
        currentTime={booking.time}
      />

      <CancellationDialog
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
        onConfirm={handleCancellation}
        isSameDay={isSameDay}
        remainingCancellations={remainingCancellations}
      />
    </div>
</div>
  );
};

export default BookingDetail;
