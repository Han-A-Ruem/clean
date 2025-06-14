
import React from "react";
import { format } from "date-fns";
import { Reservation } from "@/types/reservation";
import StatusBadge from "./StatusBadge";
import { Home, Calendar, Clock, User } from "lucide-react";

interface BookingCardProps {
  booking: Reservation;
  onClick: () => void;
  onComplete?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onClick, onComplete }) => {
  const formatDate = (date: string[] | string | null): string => {
    if (!date) return "날짜 미정";
    
    try {
      if (Array.isArray(date)) {
        if (date.length === 0) return "날짜 미정";
        return format(new Date(date[0]), "MM.dd(eee)");
      }
      return format(new Date(date), "MM.dd(eee)");
    } catch (error) {
      return "날짜 형식 오류";
    }
  };
  
  const formatTime = (time: string | null): string => {
    if (!time) return "";
    return time;
  };
  
  const getServiceTitle = (): string => {
    if (!booking.type) return "가사 청소";
    
    switch(booking.type) {
      case "regular":
        return "가사 청소";
      case "deep":
        return "특수 청소";
      case "move":
        return "이사 청소";
      case "kitchen":
        return "주방 청소";
      case "bathroom":
        return "화장실 청소";
      case "fridge":
        return "냉장고 청소";
      default:
        return booking.type;
    }
  };

  const getCleanerName = (): string => {
    // If there's user_details for the cleaner, use that
    if (booking.user_details?.name) {
      return booking.user_details.name;
    }
    // Otherwise return a placeholder
    return "전문가";
  };
  
  const getCardBackground = (): string => {
    if (booking.status === 'pending' || booking.status === 'matching') {
      return "bg-yellow-50/60";
    }
    return "bg-white/60";
  };
  
  const handleCompleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <div 
      className={`${getCardBackground()} p-6 rounded-2xl shadow-sm mb-4 cursor-pointer backdrop-blur-md border border-white/40 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]`} 
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Service Type and Status */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-lg font-medium text-gray-800">{getServiceTitle()}</span>
          </div>
          <StatusBadge status={booking.status} date={booking.date} />
        </div>
        
        {/* Cleaner Info */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="w-4 h-4" />
          <span>{getCleanerName()}</span>
        </div>
        
        {/* Date and Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-lg font-bold text-gray-800">
              {formatDate(booking.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>
              {booking.status === 'completed' 
                ? "서비스 완료" 
                : `예약 시간: ${formatTime(booking.time)}`}
            </span>
          </div>
        </div>
        
        {/* Complete Button (show only if not completed and onComplete is provided) */}
        {booking.status !== 'completed' && onComplete && (
          <div className="flex justify-end mt-3">
            <button 
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm transition-colors shadow-sm"
              onClick={handleCompleteClick}
            >
              완료
            </button>
          </div>
        )}
        
        {/* Service Completion Message */}
        {booking.status === 'completed' && (
          <div className="text-gray-500 bg-gray-100/50 p-3 rounded-xl backdrop-blur-sm">
            서비스가 완료되었습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
