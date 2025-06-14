
import { ReservationData } from "@/types/reservation";

export const formatTimeRange = (reservation: ReservationData | null) => {
  if (!reservation?.time) return "오후 1:41~5:41";

  try {
    const timeStr = reservation.time;
    const hours = parseInt(timeStr.split(':')[0]);
    const minutes = parseInt(timeStr.split(':')[1]);

    const period1 = hours >= 12 ? "오후" : "오전";
    const displayHour1 = hours > 12 ? hours - 12 : hours;

    const duration = reservation.duration || 4;
    const endHours = hours + (typeof duration === 'number' ? duration : parseFloat(duration));
    const endMinutes = minutes;
    
    const decimalPart = typeof duration === 'number' ? duration % 1 : 0;
    let finalEndMinutes = endMinutes;
    if (decimalPart > 0) {
      finalEndMinutes = endMinutes + Math.round(decimalPart * 60);
      if (finalEndMinutes >= 60) {
        finalEndMinutes -= 60;
      }
    }
    
    const period2 = endHours >= 12 ? "오후" : "오전";
    const displayHour2 = endHours > 12 ? endHours - 12 : endHours;

    return `${period1} ${displayHour1}:${minutes.toString().padStart(2, '0')}~${period2} ${Math.floor(displayHour2)}:${finalEndMinutes.toString().padStart(2, '0')}`;
  } catch (e) {
    return "오후 1:41~5:41";  
  }
};

export const formatDuration = (reservation: ReservationData | null) => {
  const hours = reservation?.duration || 4;
  const hoursInt = Math.floor(Number(hours));
  const minutesPart = Math.round((Number(hours) - hoursInt) * 60);
  
  if (minutesPart > 0) {
    return `총 ${hoursInt}시간 ${minutesPart}분`;
  }
  return `총 ${hours}시간`;
};

export const formatTime = (decimal: number) => {
  const minutes = Math.floor(decimal);
  const seconds = Math.round((decimal - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
