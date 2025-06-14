import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Clock } from 'lucide-react';
import TimeLimitAlert from '@/components/TimeLimitAlert';

interface VisitTimeSheetProps {
  visitTime: string | null;
  visitTimeTemp: string | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onVisitTimeSelect: (time: string) => void;
  onConfirm: () => void;
  serviceHours?: number;
  pulse?: string| null;
}

const VisitTimeSheet: React.FC<VisitTimeSheetProps> = ({
  visitTime,
  visitTimeTemp,
  isOpen,
  onOpenChange,
  onVisitTimeSelect,
  onConfirm,
  serviceHours = 2,
  pulse
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const availableVisitTimes = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00"
  ];
  
  const handleTimeSelect = (time: string) => {
    const hour = parseInt(time.split(':')[0], 10);
    
    if (hour + serviceHours > 16) {
      setSelectedTime(time);
      setAlertOpen(true);
      return;
    }
    
    onVisitTimeSelect(time);
  };
  
  return (
    <div className="flex justify-between items-center py-4 border-b">
      <div>
        <h3 className="text-lg font-medium">방문 시간</h3>
        <p className="text-gray-500 text-sm">{visitTime || "선택"}</p>
      </div>
      <SheetTrigger asChild>
        <button className={cn("text-primary-user font-medium", pulse)}>선택</button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-center">방문 시간 선택</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {availableVisitTimes.map((time) => {
            const hour = parseInt(time.split(':')[0], 10);
            const isDisabled = hour + serviceHours > 16;
            
            return (
              <Button
                key={time}
                variant={visitTimeTemp === time ? "default" : "outline"}
                className={cn(
                  "py-4",
                  visitTimeTemp === time ? "bg-primary-user hover:bg-primary-user" : "",
                  isDisabled ? "opacity-50" : ""
                )}
                onClick={() => handleTimeSelect(time)}
              >
                <Clock className="w-4 h-4 mr-2" />
                {time}
              </Button>
            );
          })}
        </div>
        <Button
          onClick={onConfirm}
          className="w-full py-4 text-lg bg-primary-user hover:bg-primary-user"
        >
          확인
        </Button>
      </SheetContent>
      
      <TimeLimitAlert 
        open={alertOpen} 
        onOpenChange={setAlertOpen}
        selectedTime={selectedTime || ""}
        serviceHours={serviceHours}
      />
    </div>
  );
};

export default VisitTimeSheet;
