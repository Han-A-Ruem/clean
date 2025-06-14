
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock, Trash2 } from "lucide-react";

interface BookingActionButtonsProps {
  showButtons: boolean;
  onReschedule: () => void;
  onCancel: () => void;
}

const BookingActionButtons: React.FC<BookingActionButtonsProps> = ({
  showButtons,
  onReschedule,
  onCancel
}) => {
  if (!showButtons) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4 mx-4 my-6">
      <Button 
        variant="outline" 
        className="flex items-center justify-center gap-2 h-14 rounded-xl shadow-sm backdrop-blur-sm bg-white/70 border border-gray-200/70 transition-all hover:bg-white hover:shadow" 
        onClick={onReschedule}
      >
        <CalendarClock className="w-5 h-5 text-blue-500" />
        <span className="text-gray-800 font-medium">일정 변경</span>
      </Button>
      <Button 
        variant="destructive" 
        className="flex items-center justify-center gap-2 h-14 rounded-xl shadow-sm transition-all hover:shadow" 
        onClick={onCancel}
      >
        <Trash2 className="w-5 h-5" />
        <span className="font-medium">예약 취소</span>
      </Button>
    </div>
  );
};

export default BookingActionButtons;
