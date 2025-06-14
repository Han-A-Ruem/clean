
/**
 * Safely get a string date from either a string array or string
 * @param date The date value which could be either a string array or string
 * @returns A string date or empty string if none exists
 */
export const getDateString = (date: string[] | string | null | undefined): string => {
  if (!date) return '';
  
  if (Array.isArray(date) && date.length > 0) {
    return date[0];
  }
  
  return typeof date === 'string' ? date : '';
};

/**
 * Safely convert a date value to a Date object
 * @param date The date value which could be a string array, string, or Date
 * @returns A Date object or null if conversion fails
 */
export const toDateObject = (date: string[] | string | Date | null | undefined): Date | null => {
  if (!date) return null;
  
  try {
    if (date instanceof Date) return date;
    
    const dateStr = getDateString(date);
    if (!dateStr) return null;
    
    return new Date(dateStr);
  } catch (e) {
    console.error("Error converting date:", e);
    return null;
  }
};

/**
 * Format a date value to a local date string
 * @param date The date value which could be a string array, string, or Date
 * @returns A formatted date string or empty string if conversion fails
 */
export const formatDate = (date: string[] | string | Date | null | undefined): string => {
  const dateObj = toDateObject(date);
  if (!dateObj) return '';
  
  return dateObj.toLocaleDateString();
};

/**
 * Compare a date value with a string date
 * @param dateValue The date value which could be a string array or string
 * @param compareValue The string date to compare with
 * @returns boolean indicating if the dates match
 */
export const compareDates = (dateValue: string[] | string | null | undefined, compareValue: string): boolean => {
  if (!dateValue) return false;
  
  const dateStr = getDateString(dateValue);
  return dateStr === compareValue;
};
