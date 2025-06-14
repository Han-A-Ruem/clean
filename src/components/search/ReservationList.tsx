import React from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/components/home/DateUtils";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../bookings/utils/bookingUtils";
import { format } from "date-fns";
import { formatCustomDate, translateReservationType, translateType } from "@/utils/translators";

interface Reservation {
  id: string;
  date: string[] | string | null;
  time: string | null;
  address: string | null;
  type: string | null;
  amount: number | null;
  created_at: string;
  reservation_type?: string | null;
}

interface ReservationListProps {
  reservations: Reservation[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  userId?: string;
}

const ReservationList: React.FC<ReservationListProps> = ({ 
  reservations, 
  isLoading, 
  error, 
  refetch,
  userId
}) => {
  const navigate = useNavigate();

  const handleJobClick = (id: string) => {
    navigate(`/job/${id}`);
  };



  const formatTime = (time: string | null): string => {
    if (!time) return "";
    // Remove seconds if they exist
    return time.split(':').slice(0, 2).join(':');
  };



  return (
    <div className="p-4 space-y-4">
      {isLoading ? (
        Array(3).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-5 w-1/2 mb-2" />
            <Skeleton className="h-4 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        ))
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          데이터를 불러올 수 없습니다. 다시 시도해주세요.
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            className="mt-2 mx-auto block"
          >
            다시 시도
          </Button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          조건에 맞는 업무가 없습니다. 다른 조건으로 검색해보세요.
        </div>
      ) : (
        reservations.map((reservation) => (
          <div 
            key={reservation.id} 
            className="bg-white rounded-lg shadow p-4 cursor-pointer"
            onClick={() => handleJobClick(reservation.id)}
          >
            <div className="flex gap-2 mb-3">
              <span className="px-3 py-1 bg-[#E9F8FF] text-[#0086C9] rounded-full text-sm">
                {translateType(reservation.type)}
              </span>
              <span className="px-3 py-1 bg-[#E9F8FF] text-[#0086C9] rounded-full text-sm">
                {translateReservationType(reservation.reservation_type)}
              </span>
            </div>

            <p className="text-lg mb-2">
              {formatCustomDate(reservation.date)} 부터 시작
            </p>
            
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{reservation.time ? `오전 ${formatTime(reservation.time)}` : ''}</span>
            </div>
            
            <p className="text-gray-600 mb-4">
              {reservation.address}
            </p>

            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <span className="bg-[#F3F4F6] p-1 rounded-full mr-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
               {formatPrice(reservation.amount)}
              </span>
              <span className="text-[#00C8B0]">+ 상생지원금 도전!</span>
            </div>
          </div>
        ))
      )}

      {!userId && (
        <button className="w-full py-4 px-6 bg-white rounded-lg shadow flex items-center justify-between">
          <span className="text-gray-900">가까운 정기 업무 더보기</span>
          <div className="flex items-center">
            <span className="mr-2 text-primary-cleaner">3건</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      )}

      {!userId && (
        <div className="pb-12 px-4 left-4 right-4">
          <div className="bg-[#424756] text-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-medium">청소연구소 클린 캠페인</h3>
              <p className="text-sm">청소연구소는 직접대금 금지합니다.</p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-full p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                3
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
