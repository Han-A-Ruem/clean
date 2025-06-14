
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { format, isToday, isSameDay, getDay, addMonths, isSameMonth, addDays, addWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs } from './hooks/useDateSelection';

interface CalendarDatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dates: Date[]) => void;
  selectedDays: string[];
  activeTab: Tabs
  initialDate?: Date;
}

const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_INDEX_MAP: Record<string, number> = {
  '일': 0,
  '월': 1,
  '화': 2,
  '수': 3,
  '목': 4,
  '금': 5,
  '토': 6
};

const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedDays,
  activeTab,
  initialDate,
}) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDateList, setSelectedDateList] = useState<Date[]>([]);
  const [monthsToShow, setMonthsToShow] = useState<Date[]>([]);
  
  useEffect(() => {
    if (selectedDays.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (activeTab === 'once_weekly') {
        const selectedDayIndex = DAY_INDEX_MAP[selectedDays[0]];
        const closestDate = findClosestDateForDay(today, selectedDayIndex);
        setSelectedDateList([closestDate]);
      } else if (activeTab === 'multiple_weekly') {
        generateWeeklyDates(today);
      } else if (activeTab === 'biweekly' || activeTab === 'multiple_biweekly') {
        generateBiWeeklyDates(today);
      } else if (activeTab === 'once_monthly' || activeTab === 'multiple_monthly') {
        generateMonthlyDates(today);
      } else {
        const nextDates: Date[] = [];
        
        selectedDays.forEach(day => {
          const dayIndex = DAY_INDEX_MAP[day];
          const nextDate = findClosestDateForDay(today, dayIndex);
          nextDates.push(nextDate);
        });
        
        nextDates.sort((a, b) => a.getTime() - b.getTime());
        setSelectedDateList(nextDates);
      }
    } else {
      setSelectedDateList([]);
    }
  }, [selectedDays, activeTab]);
  
  const generateWeeklyDates = (startDate: Date) => {
    const dates: Date[] = [];
    const endDate = addMonths(startDate, 3);
    
    selectedDays.forEach(day => {
      const dayIndex = DAY_INDEX_MAP[day];
      let currentDate = findClosestDateForDay(startDate, dayIndex);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 7); // Add one week
      }
    });
    
    dates.sort((a, b) => a.getTime() - b.getTime());
    setSelectedDateList(dates);
  };
  
  const generateBiWeeklyDates = (startDate: Date) => {
    const dates: Date[] = [];
    const endDate = addMonths(startDate, 3);
    
    selectedDays.forEach(day => {
      const dayIndex = DAY_INDEX_MAP[day];
      let currentDate = findClosestDateForDay(startDate, dayIndex);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate = addWeeks(currentDate, 2); // Add two weeks
      }
    });
    
    dates.sort((a, b) => a.getTime() - b.getTime());
    setSelectedDateList(dates);
  };
  
  const generateMonthlyDates = (startDate: Date) => {
    const dates: Date[] = [];
    const endDate = addMonths(startDate, 3);
    
    selectedDays.forEach(day => {
      const dayIndex = DAY_INDEX_MAP[day];
      let currentDate = findClosestDateForDay(startDate, dayIndex);
      
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        // Find the same day in the next month
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        currentDate = findClosestDateForDay(nextMonth, dayIndex);
      }
    });
    
    dates.sort((a, b) => a.getTime() - b.getTime());
    setSelectedDateList(dates);
  };
  
  const findClosestDateForDay = (startDate: Date, targetDayIndex: number): Date => {
    let current = new Date(startDate);
    let daysToAdd = (targetDayIndex - current.getDay() + 7) % 7;
    
    if (daysToAdd === 0) {
      return current;
    }
    
    return addDays(current, daysToAdd);
  };
  
  useEffect(() => {
    if (initialDate) {
      setSelectedDateList(prevList => {
        if (activeTab === 'once_weekly' || activeTab === 'biweekly' || activeTab === 'once_monthly') {
          return [initialDate];
        }
        return [...prevList, initialDate];
      });
    }
  }, [initialDate, activeTab]);
  
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const months = [];
    
    for (let i = 0; i <= 11 - currentMonth; i++) {
      months.push(new Date(currentYear, currentMonth + i, 1));
    }
    
    setMonthsToShow(months);
  }, []);

  if (!isOpen) return null;

  const shouldDisableDate = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }

    if (selectedDays.length === 0) {
      return true;
    }

    const dayIndex = getDay(date);
    const koreanDay = DAYS_OF_WEEK[dayIndex];

    return !selectedDays.includes(koreanDay);
  };

  const handleDateSelect = (date: Date) => {
    if (shouldDisableDate(date)) {
      return;
    }

    setSelectedDateList(prevDates => {
      if (activeTab === 'once_weekly' || activeTab === 'biweekly' || activeTab === 'once_monthly') {
        return [date];
      } else {
        const isDateSelected = prevDates.some(selectedDate => 
          isSameDay(selectedDate, date)
        );

        if (isDateSelected) {
          return prevDates.filter(selectedDate => !isSameDay(selectedDate, date));
        } else {
          return [...prevDates, date];
        }
      }
    });
  };

  const handleConfirm = () => {
    if (selectedDateList.length > 0) {
      onSelect(selectedDateList);
      onClose();
    }
  };

  const renderCalendarMonth = (monthDate: Date) => {
    const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const lastDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    return (
      <div key={monthDate.toString()} className="mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {format(monthDate, 'yyyy.M')}
        </h2>
        
        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="w-10 h-10 flex items-center justify-center text-sm text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays(
            monthDate.getFullYear(),
            monthDate.getMonth(),
            firstDayOfWeek,
            daysInMonth
          )}
        </div>
      </div>
    );
  };

  const renderCalendarDays = (year: number, month: number, firstDay: number, daysCount: number) => {
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}-${month}`} className="w-10 h-10"></div>);
    }
    
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDateList.some(selectedDate => 
        isSameDay(selectedDate, date)
      );
      const isTodayDate = isToday(date);
      const isDisabled = shouldDisableDate(date);
      
      days.push(
        <button
          key={`day-${day}-${month}`}
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center text-sm",
            isSelected ? "bg-primary-user text-white" : "",
            isTodayDate && !isSelected ? "border border-primary-user text-primary" : "",
            isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-primary-user hover:text-white",
            !isDisabled && !isSelected && !isTodayDate ? "text-gray-700" : ""
          )}
          disabled={isDisabled}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  const renderSelectedDates = () => {
    if (selectedDateList.length === 0) return null;

    return (
      <div className="px-4 py-2 border-t">
        <div className="flex flex-wrap gap-2">
          {selectedDateList.map((date, index) => (
            <div 
              key={date.toString()} 
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {format(date, 'M월 d일')}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <button onClick={onClose} className="p-2">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-medium">시작일을 선택해주세요</h1>
        <div className="w-10"></div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {monthsToShow.map(renderCalendarMonth)}
        </div>
      </div>

      {renderSelectedDates()}
      
      <div className="p-4 border-t">
        <Button
          onClick={handleConfirm}
          className="w-full py-6 bg-primary-user text-white hover:bg-primary-user/90 rounded-full"
          disabled={selectedDateList.length === 0}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default CalendarDatePicker;
