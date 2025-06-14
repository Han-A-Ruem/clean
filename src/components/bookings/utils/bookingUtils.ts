
import { format, isBefore, parseISO, set } from "date-fns";
import { Reservation } from "@/types/reservation";
import { getDateString } from "@/components/home/DateUtils";

export const formatDate = (date: string[] | string | null): string => {
  if (!date) return "날짜 미정";
  
  try {
    if (Array.isArray(date)) {
      if (date.length === 0) return "날짜 미정";
      return format(new Date(date[0]), "yyyy년 MM월 dd일");
    }
    return format(new Date(date), "yyyy년 MM월 dd일");
  } catch (error) {
    return "날짜 형식 오류";
  }
};

export const formatTime = (time: string | null): string => {
  if (!time) return "시간 미정";
  return time;
};

export const getServiceType = (type: string | null): string => {
  if (!type) return "청소 서비스";
  
  switch(type) {
    case "regular":
      return "정기 가사청소";
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
      return type;
  }
};

export const formatPrice = (amount: number | null): string => {
  if (!amount) return "0원";
  return amount.toLocaleString() + "원";
};

export const canModifyBooking = (booking: Reservation): boolean => {
  if (!booking.date) return false;
  
  try {
    let bookingDateStr: string;
    
    if (Array.isArray(booking.date)) {
      if (booking.date.length === 0) return false;
      bookingDateStr = booking.date[0];
    } else {
      bookingDateStr = booking.date;
    }
    
    const bookingDate = parseISO(bookingDateStr);
    
    // Set the cutoff time to 17:00 the day before
    const bookingDateCutoff = set(bookingDate, { hours: 0, minutes: 0, seconds: 0 });
    const cutoffDate = set(bookingDateCutoff, { hours: 17 });
    
    const now = new Date();
    
    // Allow modification if now is before the cutoff time
    return isBefore(now, cutoffDate);
  } catch (error) {
    console.error("Error checking modification eligibility:", error);
    return false;
  }
};
