
import { useState, useEffect, useMemo } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, CircleCheck, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format, addMonths, subMonths, startOfMonth, getDaysInMonth, isSameDay, parseISO, isWithinInterval, endOfMonth } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showJobSheet, setShowJobSheet] = useState(false);
  const [showCancellationSheet, setShowCancellationSheet] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Get the date parameter from the location state or URL search params
  const locationState = location.state as { showBottomSheet?: boolean; selectedDate?: string } | null;
  const searchParams = new URLSearchParams(location.search);
  const dateParam = searchParams.get('date') || locationState?.selectedDate;

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonthDays = Array.from(
    { length: firstDayOfMonth },
    (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - firstDayOfMonth + i + 1
  );

  // Fetch reservations using React Query
  const fetchReservations = async () => {
    if (!userData?.user_id) {
      throw new Error("User not available");
    }

    const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      address:address(*)
    `)
    .eq('cleaner_id', userData.user_id);
    if (error) throw error;
    return data || [];
  };

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['reservations', userData?.user_id],
    queryFn: fetchReservations,
    enabled: !!userData?.user_id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch specific reservation if ID is provided in URL
  const fetchReservationById = async (reservationId: string) => {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        address:address (*)
      `)
      .eq('id', reservationId)
      .single();

    if (error) throw error;
    return data;
  };

  const {
    data: routeReservation,
    isLoading: isLoadingReservation,
    isError: isReservationError
  } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => fetchReservationById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Filter reservations for the current month
  const filteredReservations = useMemo(() => {
    if (!reservations.length) return [];
    
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    
    return reservations.filter(res => {
      if (!res.date || !res.date.length) return false;
      
      // Check if any of the reservation dates are within the current month
      return res.date.some(dateStr => {
        const date = new Date(dateStr);
        return isWithinInterval(date, { start, end });
      });
    });
  }, [reservations, currentDate]);

  // Handle route ID parameter to show specific reservation
  useEffect(() => {
    if (id && routeReservation && !isLoadingReservation) {
      // Check if this reservation belongs to the current cleaner
      if (routeReservation.cleaner_id === userData?.user_id) {
        setSelectedReservation(routeReservation);
        setShowJobSheet(true);

        // If we have a date, set the calendar to show that month
        if (routeReservation.date && routeReservation.date.length > 0) {
          const reservationDate = new Date(routeReservation.date[0]);
          setCurrentDate(new Date(
            reservationDate.getFullYear(),
            reservationDate.getMonth(),
            1
          ));
          setSelectedDay(reservationDate.getDate());
        }
      } else {
        // Handle case where reservation ID exists but doesn't belong to this cleaner
        toast({
          variant: "destructive",
          title: "접근 권한 없음",
          description: "이 예약에 접근할 수 없습니다.",
        });
        navigate('/schedule');
      }
    } else if (id && isReservationError) {
      // Handle case where reservation ID doesn't exist
      toast({
        variant: "destructive",
        title: "예약을 찾을 수 없음",
        description: "요청하신 예약을 찾을 수 없습니다.",
      });
      navigate('/schedule');
    }
  }, [id, routeReservation, isLoadingReservation, isReservationError, userData?.user_id, navigate, toast]);

  // Handle navigation state and URL parameters
  useEffect(() => {
    if (dateParam && reservations.length > 0) {
      // Find the reservation that matches the selected date
      const reservation = reservations.find(res => res.date.includes(dateParam));

      if (reservation) {
        // Set the selected reservation for the bottom sheet
        setSelectedReservation(reservation);
        setShowJobSheet(true);

        // Set the selected day to highlight in calendar
        const selectedDate = new Date(dateParam);
        setSelectedDay(selectedDate.getDate());

        // Update the current month view if needed
        if (selectedDate.getMonth() !== currentDate.getMonth() ||
          selectedDate.getFullYear() !== currentDate.getFullYear()) {
          setCurrentDate(selectedDate);
        }
      }

      // Clear the location state to prevent re-showing on refresh
      if (locationState) {
        navigate(location.pathname, { replace: true, state: undefined });
      }

      // Clear URL parameters if they exist
      if (searchParams.has('date')) {
        searchParams.delete('date');
        navigate({
          pathname: location.pathname,
          search: searchParams.toString()
        }, { replace: true });
      }
    }
  }, [location, reservations, navigate, currentDate, dateParam, locationState, searchParams]);

  // Calculate derived state using useMemo to avoid recalculations - now based on filtered reservations
  const {
    totalHours,
    expectedIncome,
    reservationCount,
    completedCount
  } = useMemo(() => ({
    totalHours: filteredReservations.reduce((sum, res) => sum + (Number(res.duration) || 0), 0),
    expectedIncome: filteredReservations.filter(res => res.status === 'completed').reduce((sum, res) => sum + (res.amount || 0), 0),
    reservationCount: filteredReservations.filter(res => res.status !== 'completed').length,
    completedCount: filteredReservations.filter(res => res.status === 'completed').length,
  }), [filteredReservations]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getReservationCount = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const reservationsOnDate = reservations.filter(
      res => res.date.includes(format(dateToCheck, 'yyyy-MM-dd'))
    );
    return reservationsOnDate.length;
  };

  const handleReservationClick = (day) => {
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day)).toISOString().split('T')[0];
    const reservation = reservations.find(reservation => reservation.date.includes(date));
    setSelectedReservation(reservation);
    setShowJobSheet(true);
  };

  const formatTimeRange = (startTime: string, duration: number): string => {
    if (!startTime) return "시간 정보 없음";

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + duration);

    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours < 12 ? '오전' : '오후';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${period} ${formattedHours}:${formattedMinutes}`;
    };

    const formattedStartTime = formatTime(startDate);
    const formattedEndTime = formatTime(endDate);

    return `${formattedStartTime}~${formattedEndTime}`;
  };

  const getDayLabel = (dateString: string) => {
    const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date(dateString);
    const dayIndex = date.getDay();
    return dayLabels[dayIndex];
  };

  const renderCalendarContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="h-20 w-20 flex flex-col items-center">
              <Skeleton className="h-6 w-6 rounded-full mb-2" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-y-4 ">
        {prevMonthDays.map((day) => (
          <div key={`prev-${day}`} className="text-center text-gray-400">
            {day}
          </div>
        ))}

        {daysArray.map((day) => {
          const reservationCount = getReservationCount(day);
          return (
            <div
              key={day}
              className={cn(
                "text-center relative h-20",
                day === selectedDay && "font-bold text-[#00C8B0]",
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0 && "text-red-500"
              )}
            >
              {day}
              {reservationCount > 0 && (
                <button
                  onClick={() => handleReservationClick(day)}
                  className={cn(
                    "absolute top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-sm",
                    day === selectedDay ? "bg-blue-700 text-white" : "bg-blue-400 text-white"
                  )}
                >
                  {reservationCount}건
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());

    // Find reservation for today if any
    const todayString = format(today, 'yyyy-MM-dd');
    const todayReservation = reservations.find(res =>
      res.date && res.date.includes(todayString)
    );

    if (todayReservation) {
      setSelectedReservation(todayReservation);
      setShowJobSheet(true);
    }
  };

  return (
    <div className="pb-20">
      {/* Header with total income */}
      <div className="p-6 pb-8">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-8 w-32" />
              </>
            ) : (
              <>
                {format(currentDate, 'M')}월 수입은<br />
                {expectedIncome.toLocaleString()}원 입니다.
              </>
            )}
          </h1>
          <Sheet open={showCancellationSheet} onOpenChange={setShowCancellationSheet}>
            <SheetTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>취소현황</span>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold">본인 취소 현황</h2>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <div className="flex justify-center gap-4 mb-4">
                    {Array.from({ length:userData?.monthly_cancellation_limit }, (_, num) => num + 1).map((num) => (
                      <div
                        key={num}
                        className={`bg-white p-4 rounded-lg flex flex-col items-center justify-center w-20 h-20  border-dashed border  ${(userData.monthly_cancellations) >= num ? "border-gray/50 text-gray-400": "border-black"} 
                          }`}
                      >

                        {num}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={num <= (userData?.monthly_cancellations || 0) ? "#d1d5db" : "currentColor"}
                          strokeWidth="2"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-sm mt-1">취소 {num}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <p className="text-lg mb-1">취소 가능 {userData?.monthly_cancellation_limit || 3}회 중</p>
                    <p className="text-xl">
                      <span className="text-[#00B5B4]">{userData?.monthly_cancellations || 0}</span>회 취소함
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-lg">정책 안내</h3>
                  <ul className="space-y-4 text-gray-600">
                    <li>• 1회/정기 업무의 경우 월 {userData?.monthly_cancellation_limit || 3}회 직접 취소 가능합니다.</li>
                    <li>• 정기 업무의 경우 아직 방문하지 않은 경우에만 업무 전체 취소 가능합니다.</li>
                    <li>• 앱을 통해 직접 업무를 취소하면 취소 횟수가 카운팅됩니다.</li>
                    <li>• 월 {userData?.monthly_cancellation_limit || 3}회 이상 취소하신 경우 업무 선택이 제한될 수 있으니 주의 바랍니다.</li>
                    <li>• 매월 1일 취소 가능 횟수가 초기화 됩니다.</li>
                    <li>• 취소 횟수는 아직 방문하지 않은 업무를 직접 취소시 적용됩니다.</li>
                  </ul>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex gap-4 text-gray-600">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-20" />
            </>
          ) : (
            <>
              <span>총 {totalHours}시간</span>
              <span>예정 {reservationCount}</span>
              <span>완료 {completedCount}</span>
            </>
          )}
        </div>
      </div>

      {/* Calendar Header */}
      <div className="px-4 mb-20">
        <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
          <button
            className="p-4 border rounded-lg flex items-center"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
            {format(subMonths(currentDate, 1), 'M')}월
          </button>
          <h2 className="text-xl font-bold">{format(currentDate, 'M')}월</h2>
          <button
            className="p-4 border rounded-lg flex items-center"
            onClick={handleNextMonth}
          >
            {format(addMonths(currentDate, 1), 'M')}월
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Week Days */}
        <div className="grid grid-cols-7 mb-2 max-w-md mx-auto">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={cn(
                "text-center text-sm py-2",
                index === 0 && "text-red-500"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="max-w-md mx-auto">
          {renderCalendarContent()}
        </div>
      </div>

      {/* View Today Button */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex gap-4">
        <Button
          className="rounded-full hover:bg-primary-cleaner bg-white text-black border shadow-lg px-6"
          onClick={handleTodayClick}
        >
          오늘 보기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Job Details Sheet */}
      <Sheet open={showJobSheet} onOpenChange={setShowJobSheet}>
        <SheetContent side="bottom" className="p-0">
          <DialogTitle className="hidden">Reservation Details</DialogTitle>
          {selectedReservation && (
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {selectedReservation.date && selectedReservation.date.length > 0
                    ? `${format(new Date(selectedReservation.date[0]), 'M.d')}(${getDayLabel(selectedReservation.date[0])}) 업무`
                    : "업무 상세"
                  }
                </h2>
              </div>

              <div className="space-y-4">
                <span className="flex flex-row justify-between items-center">
                  <div className={`${selectedReservation.status === 'completed' ? 'bg-gray-300 text-white' : 'bg-blue-100 text-blue-600'} w-fit px-4 py-2 rounded-lg`}>
                    {selectedReservation.type || '가정'}
                  </div>
                  {selectedReservation.status === 'completed' && (
                    <span className="flex text-gray-300 space-x-1" >
                      <CircleCheck fill="#d1d5db" color="white" />
                      <p>완료업무</p>
                    </span>
                  )}
                </span>
                <div className="space-y-2">
                  <p className="text-lg">
                    {formatTimeRange(
                      selectedReservation.time || "",
                      parseInt(selectedReservation.duration) || 0
                    )}
                  </p>
                  <p className="text-gray-600">
                    {selectedReservation.address?.address || selectedReservation.address || "주소 정보 없음"}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/reservation/detail/${selectedReservation.id}`)}
                  variant="outline"
                  className="w-full text-gray-600 py-6"
                >
                  보기
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Schedule;
