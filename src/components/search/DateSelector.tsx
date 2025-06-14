import React, { useState, useEffect } from "react";
import { format, addDays, isWithinInterval, isSameDay } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DateSelectorProps {
  selectedDay: string | null;
  onSelectDay: (fullDate: string) => void;
  onSelectDateRange: (dateRange: { from: Date; to: Date } | null) => void;
  dateRange: { from: Date; to: Date } | null;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDay, 
  onSelectDay, 
  onSelectDateRange,
  dateRange 
}) => {
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>(
    dateRange ? { from: dateRange.from, to: dateRange.to } : undefined
  );
  
  useEffect(() => {
    if (dateRange) {
      setLocalDateRange({ from: dateRange.from, to: dateRange.to });
    } else {
      setLocalDateRange(undefined);
    }
  }, [dateRange]);
  
  const today = new Date();
  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      day: weekDays[date.getDay()],
      date: date.getDate(),
      fullDate: format(date, 'yyyy-MM-dd'),
      dateObj: date
    };
  });

  const formatDateRange = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return "날짜 범위";
    
    const fromDate = format(dateRange.from, 'MM.dd');
    const toDate = format(dateRange.to, 'MM.dd');
    return `${fromDate} ~ ${toDate}`;
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setLocalDateRange(range);
    
    if (range?.from && range?.to) {
      onSelectDateRange({ from: range.from, to: range.to });
      onSelectDay(""); // Clear single day selection when date range is selected
    }
  };

  const isDayInRange = (date: Date) => {
    if (!dateRange || !dateRange.from || !dateRange.to) return false;
    return isWithinInterval(date, { start: dateRange.from, end: dateRange.to });
  };

  const isSelectedDay = (dateStr: string) => {
    if (selectedDay === dateStr) return true;
    if (selectedDay === null && !dateRange) return false;
    return false;
  };

  return (
    <div className="overflow-x-auto border-b">
      <div className="flex items-center p-2 min-w-full">
        <div 
          className={`flex-shrink-0 w-16 h-16 ${selectedDay === null && !dateRange ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg flex items-center justify-center mr-2 cursor-pointer`}
          onClick={() => {
            onSelectDay("");
            onSelectDateRange(null);
          }}
        >
          <span>전체</span>
        </div>
        
        {nextDays.map((dayInfo, index) => (
          <div
            key={index}
            onClick={() => {
              onSelectDay(dayInfo.fullDate);
              onSelectDateRange(null); // Clear date range when a single day is selected
            }}
            className={`flex-shrink-0 w-16 text-center mx-1 py-2 rounded-lg cursor-pointer ${isSelectedDay(dayInfo.fullDate) ? 'bg-gray-800 text-white' : isDayInRange(dayInfo.dateObj) ? 'bg-gray-300' : ''}`}
          >
            <div className={`${isSelectedDay(dayInfo.fullDate) ? 'text-white' : isDayInRange(dayInfo.dateObj) ? 'text-gray-800' : 'text-gray-600'}`}>{dayInfo.day}</div>
            <div className={`text-lg ${isSelectedDay(dayInfo.fullDate) ? 'text-white' : isDayInRange(dayInfo.dateObj) ? 'text-gray-800' : ''}`}>{dayInfo.date}</div>
          </div>
        ))}

        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={`ml-2 flex-shrink-0 h-16 ${dateRange ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white pb-4" align="start">
            <CalendarComponent
              mode="range"
              selected={localDateRange}
              onSelect={handleDateRangeSelect}
              initialFocus
              numberOfMonths={2}
              showConfirm={true}
              onConfirm={() => {
                if (localDateRange?.from && localDateRange?.to) {
                  onSelectDateRange({ 
                    from: localDateRange.from, 
                    to: localDateRange.to 
                  });
                  setIsCalendarOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateSelector;
