
import React from 'react';
import { cn } from "@/lib/utils";
import { Tabs } from './hooks/useDateSelection';

interface DaySelectorProps {
  selectedDays: string[];
  activeTab: Tabs
  onDaySelect: (day: string) => void;
  pulse?: string | null;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  activeTab,
  onDaySelect,
  pulse
}) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  
  // Determine if multiple days can be selected based on the active tab
  const allowMultipleSelection = activeTab.includes('multiple');
  
  return (
    <div className=" pl-1 flex flex-wrap gap-2 items-center overflow-x-auto hide-scrollbar py-2">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => onDaySelect(day)}
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm transition-colors",
            selectedDays.includes(day)
              ? "bg-primary-user text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200",
              pulse
          )}
        >
          {day}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
