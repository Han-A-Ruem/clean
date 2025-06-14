
import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useReservation } from "@/contexts/ReservationContext";

const DateCarousel: React.FC = () => {
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { setReservationData } = useReservation();

  useEffect(() => {
    // Generate the next 40 days starting from today (current month + about 10 days into next month)
    const generateDates = () => {
      const newDates = [];
      const today = new Date();
      
      for (let i = 0; i < 40; i++) {
        newDates.push(addDays(today, i));
      }
      
      setDates(newDates);
      // Set today as the default selected date
      setSelectedDate(today);
    };

    generateDates();
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    // Update reservation context with the selected date
    setReservationData({
      date: [date]
    });
  };

  const handleContinue = () => {
    if (selectedDate) {
      navigate('/reservation/address');
    }
  };

  // Format day name in Korean
  const formatDayName = (date: Date) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return dayNames[date.getDay()];
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2 px-4">
        <h2 className="text-base font-medium text-gray-700">날짜 선택</h2>
        <button 
          onClick={handleContinue}
          className="text-sm text-theme backdrop-blur-sm transition-colors hover:text-gray-600"
        >
          더 보기
        </button>
      </div>
      
      {/* Add a container with a mask for the fade-out effect */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50/90 to-transparent z-10 backdrop-blur-[1px]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50/90 to-transparent z-10 backdrop-blur-[1px]"></div>
        
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex px-4 py-2 space-x-3 min-w-max">
            {dates.map((date, index) => {
              const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() && 
                date.getMonth() === selectedDate.getMonth();
              
              const isToday = date.getDate() === new Date().getDate() && 
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear();
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={cn(
                    "flex flex-col items-center justify-center w-14 h-16 rounded-lg transition-all shadow-sm backdrop-blur-sm",
                    isSelected
                      ? "bg-theme text-white scale-105 shadow-md"
                      : isToday
                      ? "bg-white/80 backdrop-blur-sm border-2 border-theme/50 text-theme"
                      : "bg-white/70 backdrop-blur-sm border border-white/60 text-gray-700 hover:border-theme/30"
                  )}
                >
                  <span className="text-xs font-medium">
                    {formatDayName(date)}
                  </span>
                  <span className="text-xl font-bold">
                    {format(date, "d")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCarousel;
