
import React from "react";
import { ReservationStatus } from "@/types/reservation";
import { isFuture, parseISO } from "date-fns";

interface StatusBadgeProps {
  status: ReservationStatus | null;
  date: string[] | string | null;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, date }) => {
  // Check if the reservation is in the future
  const isUpcoming = () => {
    if (!date) return false;
    
    try {
      const dateValue = Array.isArray(date) ? date[0] : date;
      if (!dateValue) return false;
      
      const dateObj = parseISO(dateValue);
      return isFuture(dateObj);
    } catch (error) {
      console.error("Error parsing date:", error);
      return false;
    }
  };
  
  // Get badge styles based on status
  const getBadgeStyles = () => {
    if (!status) return "bg-gray-100 text-gray-600";
    
    const isReservationUpcoming = isUpcoming();
    
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-600 border border-yellow-200";
      case "matching":
        return "bg-blue-50 text-blue-600 border border-blue-200";
      case "matched":
        return "bg-indigo-50 text-indigo-600 border border-indigo-200";
      case "payment_complete":
        return "bg-lime-50 text-lime-600 border border-lime-200";
      case "confirmed":
        return "bg-green-50 text-green-600 border border-green-200";
      case "on_the_way":
        return "bg-cyan-50 text-cyan-600 border border-cyan-200";
      case "cleaning":
        return "bg-violet-50 text-violet-600 border border-violet-200";
      case "completed":
        return "bg-gray-50 text-gray-600 border border-gray-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };
  
  // Map status to Korean
  const getStatusText = () => {
    if (!status) return "상태 미정";
    
    const isReservationUpcoming = isUpcoming();
    
    switch (status) {
      case "pending":
        return "대기중";
      case "matching":
        return "매칭중";
      case "matched":
        return "매칭완료";
      case "payment_complete":
        return "결제완료";
      case "confirmed":
        return "확정됨";
      case "on_the_way":
        return "이동중";
      case "cleaning":
        return "청소중";
      case "completed":
        return "완료됨";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
  };
  
  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm shadow-sm ${getBadgeStyles()}`}>
      {getStatusText()}
    </div>
  );
};

export default StatusBadge;
