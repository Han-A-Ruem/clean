
import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

interface InterviewCalendarProps {
  onSelectDate: (date: Date) => void;
}

const InterviewCalendar: React.FC<InterviewCalendarProps> = ({ onSelectDate }) => {
  // This component is now simplified as we'll be showing date cards directly in the parent component
  return (
    <div className="text-center py-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <CalendarIcon className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-medium">날짜를 선택해주세요</h2>
        <p className="text-muted-foreground">인터뷰 일정을 선택하려면 날짜카드를 클릭하세요</p>
      </div>
    </div>
  );
};

export default InterviewCalendar;
