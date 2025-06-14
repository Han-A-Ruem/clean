
import React from "react";
import { Reservation } from "@/types/reservation";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface BookingV2ListProps {
  reservations?: Reservation[];
  isLoading: boolean;
  onBookingClick: (booking: Reservation) => void;
}

const BookingV2List: React.FC<BookingV2ListProps> = ({
  reservations = [],
  isLoading,
  onBookingClick
}) => {
  // Separate upcoming (scheduled) and past (completed) bookings
  const upcomingBookings = reservations.filter(
    booking => booking.status !== 'completed' && booking.status !== 'cancelled'
  );
  
  const pastBookings = reservations.filter(
    booking => booking.status === 'completed' || booking.status === 'cancelled'
  );
  
  // Format date function for display
  const formatBookingDate = (date: string[] | string | null): string => {
    if (!date) return "";
    
    try {
      const dateStr = Array.isArray(date) ? date[0] : date;
      if (!dateStr) return "";
      
      const parsedDate = parseISO(dateStr);
      const formattedDate = format(parsedDate, "yy.MM.dd (E)"); // Format like "20.11.18 (수)"
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date", error);
      return "";
    }
  };
  
  const formatTime = (time: string | null): string => {
    if (!time) return "";
    
    // Format time with a tilde (e.g., "13:00 ~ 15:00")
    const timeWithEnd = time.includes("~") ? time : `${time} ~ ${time}`; 
    return timeWithEnd;
  };
  
  return (
    <div>
      {/* Header with title */}
      <div className="mb-3 text-center pt-5 pb-3">
        <h1 className="text-2xl font-medium text-gray-800">내 예약</h1>
      </div>
      
      {/* Upcoming Bookings Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-white/40 border-y border-gray-100/70">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          <span className="font-medium text-gray-800">진행예정</span>
        </div>
        
        {isLoading ? (
          <div className="px-4 py-3 space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : upcomingBookings.length > 0 ? (
          upcomingBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="mx-4 my-3 p-4 backdrop-blur-sm bg-white/70 rounded-xl shadow-sm border border-white/40 transition-all hover:shadow-md hover:translate-y-[-2px]" 
              onClick={() => onBookingClick(booking)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex gap-3 items-center mb-1">
                    <div>
                      <h3 className="font-medium text-gray-800">매주 가사청소</h3>
                      <p className="text-sm text-gray-500">청소가</p>
                    </div>
                  </div>
          
                  <div className="text-gray-600 mt-2">
                    {formatBookingDate(booking.date)} {formatTime(booking.time)}
                  </div>
                </div>

                <div className="flex flex-row items-center">
                  <div className="bg-amber-400 text-white rounded-full h-6 w-12 text-xs flex items-center justify-center mr-2">
                    완료
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4 text-gray-500 backdrop-blur-sm bg-white/40 mx-4 my-3 rounded-xl border border-white/30">
            예정된 예약이 없습니다.
          </div>
        )}
      </div>
      
      {/* Past Bookings Section */}
      <div className="pb-24">
        <div className="flex items-center gap-2 px-5 py-3 backdrop-blur-md bg-white/40 border-y border-gray-100/70">
          <AlertCircle className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-800">지난내역</span>
        </div>
        
        {isLoading ? (
          <div className="px-4 py-3 space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : pastBookings.length > 0 ? (
          pastBookings.map((booking) => (
            <div 
              key={booking.id} 
              className="mx-4 my-3 p-4 backdrop-blur-sm bg-white/70 rounded-xl shadow-sm border border-white/40 transition-all hover:shadow-md hover:translate-y-[-2px]" 
              onClick={() => onBookingClick(booking)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex gap-3 items-center mb-1">
                    <div>
                      <h3 className="font-medium text-gray-800">매주 가사청소</h3>
                      <p className="text-sm text-gray-500">청소가</p>
                    </div>
                  </div>
           
                  <div className="text-gray-600 mt-2">
                    {formatBookingDate(booking.date)} {formatTime(booking.time)}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-gray-300 text-white rounded-full h-6 w-12 text-xs flex items-center justify-center mr-2">
                    완료
                  </div>
                  <ChevronRight className="text-gray-400" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 px-4 text-gray-500 backdrop-blur-sm bg-white/40 mx-4 my-3 rounded-xl border border-white/30">
            지난 예약이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingV2List;
