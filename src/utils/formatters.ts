/**
 * Format a phone number for display
 * @param phoneNumber Phone number as a numeric value
 * @returns Formatted phone number string (e.g., "010-1234-5678")
 */
export const formatPhoneNumber = (phoneNumber: number | null): string => {
  if (!phoneNumber) return "연락처 없음";
  
  const phoneStr = phoneNumber.toString();
  
  if (phoneStr.length === 11) {
    // Format like 010-1234-5678
    return `${phoneStr.substring(0, 3)}-${phoneStr.substring(3, 7)}-${phoneStr.substring(7)}`;
  } else if (phoneStr.length === 10) {
    // Format like 02-1234-5678 or 010-123-4567
    if (phoneStr.startsWith('02')) {
      return `${phoneStr.substring(0, 2)}-${phoneStr.substring(2, 6)}-${phoneStr.substring(6)}`;
    } else {
      return `${phoneStr.substring(0, 3)}-${phoneStr.substring(3, 6)}-${phoneStr.substring(6)}`;
    }
  }
  
  // If the format is unknown, just return as is
  return phoneStr;
};

/**
 * Calculate delay time in minutes based on original scheduled time and current time
 * @param scheduledTime Time string in format "HH:MM"
 * @returns Delay time in minutes
 */
export const calculateDelayTime = (scheduledTime: string | null): number => {
  if (!scheduledTime) return 30; // Default delay time if no scheduled time
  
  try {
    const now = new Date();
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    
    const scheduledDate = new Date();
    scheduledDate.setHours(hours, minutes, 0, 0);
    
    // Calculate the difference in minutes
    const diffMs = now.getTime() - scheduledDate.getTime();
    const delayMinutes = Math.floor(diffMs / (1000 * 60));
    
    return delayMinutes > 0 ? delayMinutes : 30; // Minimum 30 minutes delay
  } catch (error) {
    console.error("Error calculating delay time:", error);
    return 30; // Default delay time on error
  }
};

/**
 * Format a date array or string for display
 * @param date Array of dates or single date string
 * @returns Formatted date string
 */
export const formatDateArray = (date: string[] | Date[] | null | undefined): string => {
  if (!date || !Array.isArray(date) || date.length === 0) return '';
  
  // Handle string dates
  if (typeof date[0] === 'string') {
    return (date[0] as string).split('T')[0];
  }
  
  // Handle Date objects
  if (date[0] instanceof Date) {
    return (date[0] as Date).toISOString().split('T')[0];
  }
  
  return '';
};

/**
 * Format a number or string as Korean Won currency
 * @param amount Amount as number or string
 * @returns Formatted Korean Won string (e.g., "50,000원")
 */
export const formatKoreanWon = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return '0원';
  
  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Check if it's a valid number
  if (isNaN(numAmount)) return '0원';
  
  // Format with thousands separators
  return numAmount.toLocaleString('ko-KR') + '원';
};
