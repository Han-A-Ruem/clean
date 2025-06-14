import { format } from "date-fns";
export const translateType = (type: string | null): string => {
  if (!type) return '가정';
  
  switch(type) {
    case 'regular':
      return '가정';
    case 'deep':
      return '특수';
    case 'move':
      return '이사';
    case 'kitchen':
      return '주방';
    case 'bathroom':
      return '화장실';
    case 'office':
      return '사무실';
    case 'childcare':
      return '육아';
    default:
      return type;
  }
};

export const translateReservationType = (type: string | null): string => {
  if (!type) return '정기';
  
  switch(type) {
    case 'regular':
      return '정기';
    case 'onetime':
      return '1회';
    case 'once_weekly':
      return '주 1회';
    case 'multiple_weekly':
      return '주 여러 회';
    case 'biweekly':
      return '격주 1회';
    case 'multiple_biweekly':
      return '격주 여러 회';
    case 'once_monthly':
      return '월 1회';
    case 'multiple_monthly':
      return '월 여러 회';
    default:
      return type;
  }
};

export const formatTimeRange = (time: string | null): string => {
  if (!time) return '';
  
  const hour = parseInt(time.split(':')[0], 10);
  let displayTime = '';
  
  if (hour < 12) {
    displayTime = `오전 ${hour.toString().padStart(2, '0')}:${time.split(':')[1]}`;
  } else {
    displayTime = `오후 ${(hour === 12 ? 12 : hour - 12).toString().padStart(2, '0')}:${time.split(':')[1]}`;
  }
  
  // Adding an estimated end time (2 hours later)
  const endHour = (hour + 2) % 24;
  const endTime = `${endHour.toString().padStart(2, '0')}:${time.split(':')[1]}`;
  const displayEndTime = endHour < 12 ? `오전 ${endTime}` : `오후 ${endHour === 12 ? 12 : endHour - 12}:${time.split(':')[1]}`;
  
  return `${displayTime} ~ ${displayEndTime}(2시간)`;
}; 

export const formatCustomDate = (date: string[] | string | null): string => {
  if (!date) return "날짜 미정";
  
  try {
    if (Array.isArray(date)) {
      if (date.length === 0) return "날짜 미정";
      return format(new Date(date[0]), "yy/MM/dd");
    }
    return format(new Date(date), "yy/MM/dd");
  } catch (error) {
    return "날짜 형식 오류";
  }
};