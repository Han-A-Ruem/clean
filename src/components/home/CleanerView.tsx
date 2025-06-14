
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Reservation } from "@/types/reservation";
import { getDateString } from "./DateUtils";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import ReservationCard from "./ReservationCard";
import { useEffect } from "react";
import { checkForRankPromotion } from "@/services/rankService";
import { toast } from "sonner";
import { fetchReservationsById, ReservationWithDetails } from "@/model/Reservation";

const CleanerView = () => {
  const navigate = useNavigate();

  // Updated function to fetch reservations with address data joined
  const fetchReservations = async (): Promise<ReservationWithDetails[]> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Check for potential rank promotion when fetching reservations
    const wasPromoted = await checkForRankPromotion(user.id).catch(err => {
      console.error("Error checking for rank promotion:", err);
      return false;
    });
    
    if (wasPromoted) {
      toast.success("축하합니다! 등급이 승급되었습니다.", {
        description: "메뉴에서 새로운 등급 혜택을 확인하세요.",
        duration: 5000,
      });
    }

    // Updated query to join both users table and addresses table
const  data = await fetchReservationsById(user.id);
    // if (error) {
    //   console.error('Error fetching reservations:', error);
    //   throw new Error(error.message);
    // }


    console.log('Fetched reservations:', data);
    // Convert data to Reservation type safely with user details and address
    return data;
  };

  // Use React Query to handle data fetching with improved caching settings
  const { 
    data: reservations = [], 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['cleaner-reservations'],
    queryFn: fetchReservations,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
    refetchOnWindowFocus: 'always', // Refetch when window regains focus
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes to keep data fresh
  });

  // Count today's and tomorrow's bookings
  const getTodayBookings = () => {
    if (!reservations || reservations.length === 0) return 0;
  
    return reservations.filter(reservation => {
      const dates = Array.isArray(reservation.date) ? reservation.date : [reservation.date];
  
      return dates.some(dateStr => {
        try {
          const date = parseISO(getDateString(dateStr));
          return isToday(date);
        } catch (e) {
          return false;
        }
      }) && reservation.status !== 'cancelled';
    }).length;
  };
  
  const getTomorrowBookings = () => {
    if (!reservations || reservations.length === 0) return 0;
  
    return reservations.filter(reservation => {
      const dates = Array.isArray(reservation.date) ? reservation.date : [reservation.date];
  
      return dates.some(dateStr => {
        try {
          const date = parseISO(getDateString(dateStr));
          return isTomorrow(date);
        } catch (e) {
          return false;
        }
      }) && reservation.status !== 'cancelled';
    }).length;
  };
  
  const getTotalReservations = () => {
    if (!reservations || reservations.length === 0) return 0;
    return reservations.filter(reservation => reservation.status !== 'cancelled').length;
  };
  
  // Get the appropriate booking message
  const getBookingMessage = () => {
    if (!reservations || reservations.length === 0) {
      return "현재 예약이 없습니다.";
    }
  
    const todayCount = getTodayBookings();
    const tomorrowCount = getTomorrowBookings();
    const totalReservations = getTotalReservations();
  
    console.log({ msg: 'get', todayCount, tomorrowCount, totalReservations });
  
    if (todayCount > 0) {
      return `오늘 ${todayCount}건의 예약이 있습니다.`;
    } else if (tomorrowCount > 0) {
      return `내일 ${tomorrowCount}건의 예약이 있습니다.`;
    } else if (totalReservations > 0) {
      return `총 ${totalReservations}건의 예약이 있으며, 오늘이나 내일 일정은 없습니다.`;
    }
  
    return "현재 예정된 예약이 없습니다.";
  };

  if (error) {
    console.error("Error loading reservations:", error);
    return (
      <div className="p-4 flex flex-col items-center">
        <p className="text-red-500 mb-4">업무 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  // Empty state view - shown when there are no reservations and not loading
  if (!isLoading && reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
          <p className="text-xl font-medium text-gray-800">예약된 업무가 없습니다.</p>
          <p className="text-gray-500">아래 버튼을 눌러 업무를 찾아보세요.</p>
          <Button 
            onClick={() => navigate('/search')}
            className="mt-4 bg-primary-cleaner hover:bg-primary-cleaner text-white px-8 py-4 rounded-full"
          >
            <MapPin className="mr-2 h-5 w-5" />
            업무찾기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">예약 현황</h1>
        {isLoading ? (
          <>
            <Skeleton className="h-5 w-40 mb-1" />
            <Skeleton className="h-4 w-56" />
          </>
        ) : (
          <>
            <p className="text-gray-700 font-medium">{getBookingMessage()}</p>
            <p className="text-gray-500 text-sm">미리 업무상황을 숙지해주세요.</p>
          </>
        )}
      </div>

      {isLoading ? (
        // Shimmer loading state for reservations
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="mb-4">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-48 mb-1" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))
      ) : reservations.length === 0 ? (
        // This section can be removed since we now have a dedicated empty state view above
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4 text-center">
          <p className="text-gray-500 mb-4">현재 예정된 업무가 없습니다.</p>
        </div>
      ) : (
        // Display reservations with the ReservationCard component
        reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))
      )}
    </div>
  );
};

export default CleanerView;
