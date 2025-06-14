import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Address, ReservationData, ServiceRequest, parseServiceRequests } from "@/types/reservation";
import { getDateString } from "./DateUtils";
import RescheduleDialog from "./RescheduleDialog";
import CancellationDialog from "./CancellationDialog";
import LateNotificationDialog from "./LateNotificationDialog";
import LateStartCleaningDialog from "./LateStartCleaningDialog";
import { isToday, format } from "date-fns";
import { calculateDelayTime } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/useNotification";

import ReservationDetailHeader from "./reservation-detail/ReservationDetailHeader";
import CustomerInfo from "./reservation-detail/CustomerInfo";
import ServiceInfo from "./reservation-detail/ServiceInfo";
import AddressInfo from "./reservation-detail/AddressInfo";
import EntryInfo from "./reservation-detail/EntryInfo";
import CleaningSupplies from "./reservation-detail/CleaningSupplies";
import CautionInfo from "./reservation-detail/CautionInfo";
import TrashInfo from "./reservation-detail/TrashInfo";
import HouseholdInfo from "./reservation-detail/HouseholdInfo";
import AdditionalInfo from "./reservation-detail/AdditionalInfo";
import SupportButtons from "./reservation-detail/SupportButtons";
import AdditionalServicesInfo from "./reservation-detail/AdditionalServicesInfo";

import { formatTimeRange, formatDuration, formatTime } from "./reservation-detail/utils/formatters";

interface CustomerData {
  id: string;
  name: string | null;
  email: string | null;
  type: string | null;
}

const ReservationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<ReservationData | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { createNotification } = useNotification();
  const [isLate, setIsLate] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancellationDialog, setShowCancellationDialog] = useState(false);
  const [showLateDialog, setShowLateDialog] = useState(false);
  const [showLateStartCleaningDialog, setShowLateStartCleaningDialog] = useState(false);
  const [isSameDay, setIsSameDay] = useState(false);
  const [delayTime, setDelayTime] = useState(30);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        setLoading(true);
        if (!id) return;
        const { data, error } = await supabase
        .from('reservations')
        .select(`* , address:address(id, address, area, name, user)
        `)
        .eq('id', id)
        .single();
      

        if (error) {
          console.error('Error fetching reservation:', error);
          toast({
            variant: "destructive",
            title: "예약을 불러올 수 없습니다",
            description: error.message,
          });
          return;
        }

        if (!data) {
          throw new Error('No reservation data found');
        }

        console.log(data);
        const serviceRequests = parseServiceRequests(data.additional_service_requests);
        
        const reservationData: ReservationData = {
          id: data.id,
          type: data.type,
          address: (data.address as unknown as Address) || null,
          amount: data.amount,
          date: data.date,
          time: data.time,
          pet: data.pet,
          infant: data.infant,
          parking: data.parking,
          supply_location: data.supply_location,
          dispose_types: data.dispose_types || [],
          is_late: data.is_late ?? false,
          status: data.status,
          user: data.user,
          cleaner_id: data.cleaner_id,
          phone_number: data.phone_number,
          created_at: data.created_at,
          duration: data.duration ?? 4,
          is_reviewed: data.is_reviewed ?? false,
          additional_service: data.additional_service || [],
          additional_service_requests: serviceRequests,
          entry: data.entry,
          unit_pass: data.unit_pass,
          lobby_pass: data.lobby_pass,
          recycle_message: data.recycle_message,
          general_message: data.general_message,
          food_message: data.food_message,
          admin_message: data.admin_message,
          cancellation_reason: data.cancellation_reason,
          days: data.days,
          area_thresh: data.area_thresh,
          is_resident: data.is_resident,
          resident_name: data.resident_name,
          resident_phone: data.resident_phone,
        };
        

        setReservation(reservationData);
        setIsLate(Boolean(data.is_late));

        if (reservationData.user) {
          const { data: customerData, error: customerError } = await supabase
            .from('users')
            .select('id, name, email, type')
            .eq('user_id', reservationData.user)
            .maybeSingle();

          if (customerError) {
            console.error('Error fetching customer:', customerError);
          } else if (customerData) {
            setCustomer(customerData);
          }
        }

        const dateString = getDateString(reservationData.date[0].toString());
        if (dateString) {
          const reservationDate = new Date(dateString);
          const currentDate = new Date();

          const reservationDateOnly = new Date(
            reservationDate.getFullYear(),
            reservationDate.getMonth(),
            reservationDate.getDate()
          );

          const currentDateOnly = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );

          setIsSameDay(isToday(reservationDateOnly));
        }
      } catch (err) {
        console.error('Error in reservation fetch:', err);
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "예약 정보를 불러오는 중 문제가 발생했습니다.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, toast]);

  const updateCleaningStatus = async () => {
    if (!id) return;
    
    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cleaning' })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating cleaning status:', error);
      toast({
        variant: "destructive",
        title: "상태 업데이트 실패",
        description: "청소 상태를 업데이트하지 못했습니다.",
      });
      return;
    }
    
    toast({
      title: "청소를 시작했습니다",
      description: "청소가 진행 중입니다.",
    });
    
    if (reservation) {
      setReservation({
        ...reservation,
        status: 'cleaning'
      });
    }
  };

  const handleSendLateNotification = async () => {
    try {
      if (!id || !reservation?.user) return;
      
      const calculatedDelayTime = calculateDelayTime(reservation.time);
      setDelayTime(calculatedDelayTime);
      
      const originalHours: number = typeof reservation.duration === 'number' ? reservation.duration : 4;
      const delayInHours: number = calculatedDelayTime / 60;
      const newServiceHours = Math.max(1, originalHours - delayInHours);
      
      const { error } = await supabase
        .from('reservations')
        .update({ 
          is_late: true,
          duration: formatTime(newServiceHours)
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating late notification status:', error);
        toast({
          variant: "destructive",
          title: "지각 알림 실패",
          description: "지각 알림을 보내는 중 오류가 발생했습니다.",
        });
        return;
      }

      await createNotification({
        userId: reservation.user,
        title: "청소 담당자가 지각할 예정입니다",
        message: `청소 담당자가 약 ${calculatedDelayTime}분 지각할 예정입니다. 이로 인해 청소 시간이 단축될 수 있습니다.`,
        type: "late"
      });
      
      setIsLate(true);
      
      if (reservation) {
        setReservation({
          ...reservation,
          is_late: true,
          duration: newServiceHours
        });
      }
      
      setShowLateDialog(true);
      
      toast({
        title: "지각 알림 전송됨",
        description: "고객에게 지각 알림이 전송되었습니다.",
      });
    } catch (err) {
      console.error('Error sending late notification:', err);
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: "지각 알림을 보내는 중 문제가 발생했습니다.",
      });
    }
  };

  const handleReschedule = async (dates: Date[], newTime: string) => {
    try {
      if (!id) return;

      const formattedDates = dates.map(date => format(date, "yyyy-MM-dd"));
      
      const { error } = await supabase
        .from('reservations')
        .update({ 
          date: formattedDates,
          time: newTime
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      if (reservation?.user) {
        await createNotification({
          userId: reservation.user,
          title: "예약 일정이 변경되었습니다",
          message: `예약이 ${dates.length > 1 ? '여러 날짜' : formattedDates[0]} ${newTime}로 변경되었습니다.`,
          type: "reschedule",
        });
      }
      
      toast({
        title: "일정이 변경되었습니다",
        description: `새로운 일정: ${dates.length > 1 ? `${dates.length}개 날짜` : formattedDates[0]} ${newTime}`,
      });

      if (reservation) {
        setReservation({
          ...reservation,
          date: formattedDates as string[],
          time: newTime
        });
      }
    } catch (error) {
      console.error("Error rescheduling reservation:", error);
      toast({
        title: "일정 변경 실패",
        description: "예약 일정을 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleCancellation = async (reason: string) => {
    try {
      if (!id) return;

      const { error } = await supabase
        .from('reservations')
        .update({ 
          status: 'cancelled',
          cancellation_reason: reason 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      if (reservation?.user) {
        await createNotification({
          userId: reservation.user,
          title: "예약이 취소되었습니다",
          message: `예약이 취소되었습니다. 사유: ${reason}`,
          type: "cancellation",
        });
      }

      toast({
        title: "예약이 취소되었습니다",
        description: "예약이 성공적으로 취소되었습니다.",
      });

      if (reservation) {
        setReservation({
          ...reservation,
          status: 'cancelled'
        });
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({
        title: "예약 취소 실패",
        description: "예약을 취소하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleWriteReview = () => {
    if (id) {
      navigate(`/reservation/detail/${id}/review`);
    }
  };

  const getFormattedTimeRange = () => formatTimeRange(reservation);
  const getFormattedDuration = () => formatDuration(reservation);

  const isCompleted = reservation?.status === 'completed';
  const canReview = isCompleted && !reservation?.is_reviewed;

  if (loading) {
    return <div className="p-4 text-center">예약 정보를 불러오는 중...</div>;
  }

  return (
    <div className="pb-20 bg-gray-100">
      <ReservationDetailHeader 
        reservation={reservation}
        isSameDay={isSameDay}
        isLate={isLate}
        setIsLate={setIsLate}
        setShowRescheduleDialog={setShowRescheduleDialog}
        setShowCancellationDialog={setShowCancellationDialog}
        setShowLateStartCleaningDialog={setShowLateStartCleaningDialog}
        updateCleaningStatus={updateCleaningStatus}
      />

      <ServiceInfo 
        reservation={reservation}
        isLate={isLate}
        formatTimeRange={getFormattedTimeRange}
        formatDuration={getFormattedDuration}
        handleSendLateNotification={handleSendLateNotification}
      />

      <CustomerInfo 
        customer={customer}
        phoneNumber={reservation?.phone_number}
      />

      <AddressInfo reservation={reservation} />

      <EntryInfo reservation={reservation} />

      <CleaningSupplies reservation={reservation} />

      <CautionInfo reservation={reservation} />

      <TrashInfo reservation={reservation} />

      <AdditionalServicesInfo reservation={reservation} />

      <HouseholdInfo reservation={reservation} />

      <AdditionalInfo reservation={reservation} />

      {canReview && (
        <div className="p-4 mt-4 bg-white border-y">
          <Button 
            onClick={handleWriteReview}
            className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-md text-lg"
          >
            서비스 리뷰 작성하기
          </Button>
        </div>
      )}

      <SupportButtons />
      
      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        onReschedule={handleReschedule}
        currentDate={reservation?.date || null}
        currentTime={reservation?.duration || null}
      />
      
      <CancellationDialog
        open={showCancellationDialog}
        onOpenChange={setShowCancellationDialog}
        onConfirm={handleCancellation}
        isSameDay={isSameDay}
      />

      <LateNotificationDialog
        open={showLateDialog}
        onOpenChange={setShowLateDialog}
        customerName={customer?.name}
        phoneNumber={reservation?.phone_number}
        delayTime={delayTime}
      />
      
      <LateStartCleaningDialog
        open={showLateStartCleaningDialog}
        onOpenChange={setShowLateStartCleaningDialog}
        customerName={customer?.name}
        phoneNumber={reservation?.phone_number}
        onConfirm={updateCleaningStatus}
      />
    </div>
  );
};

export default ReservationDetail;
