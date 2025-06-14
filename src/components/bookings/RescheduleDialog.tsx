
import { useState } from "react";
import { format, isValid, parseISO, isBefore, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDateString } from "@/components/home/DateUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (dates: Date[], time: string) => Promise<void>;
  currentDate: string | string[] | null;
  currentTime: string | null;
  allowMultipleDates?: boolean;
}

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export default function RescheduleDialog({
  open,
  onOpenChange,
  onReschedule,
  currentDate,
  currentTime,
  allowMultipleDates = false,
}: RescheduleDialogProps) {
  const tomorrow = addDays(new Date(), 1);
  
  // Parse the current dates from various possible formats
  const getInitialDates = (): Date[] => {
    if (!currentDate) return [tomorrow];
    
    try {
      // Handle string[] type
      if (Array.isArray(currentDate)) {
        if (currentDate.length > 0) {
          return currentDate.map(dateStr => {
            const parsedDate = parseISO(getDateString(dateStr));
            return isValid(parsedDate) ? parsedDate : tomorrow;
          });
        }
      } else if (typeof currentDate === 'string') {
        // Handle string type
        const parsedDate = parseISO(getDateString(currentDate));
        return [isValid(parsedDate) ? parsedDate : tomorrow];
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
    
    return [tomorrow];
  };
  
  const initialDates = getInitialDates();
  
  const [dates, setDates] = useState<Date[] | undefined>(
    initialDates.length > 0 ? initialDates : [tomorrow]
  );
  
  // Handle time in format "10:00"
  const getInitialTime = () => {
    if (!currentTime) return "09:00";
    
    if (timeSlots.includes(currentTime)) {
      return currentTime;
    }
    
    return "09:00";
  };
  
  const [time, setTime] = useState<string>(getInitialTime());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timePopoverOpen, setTimePopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleReschedule = async () => {
    if (!dates || dates.length === 0) {
      toast({
        title: "날짜를 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onReschedule(dates, time);
      toast({
        title: "예약이 성공적으로 변경되었습니다",
        description: "변경된 예약 일정을 확인해주세요.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Reschedule error:", error);
      toast({
        title: "예약 변경 실패",
        description: "예약 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSelectedDates = () => {
    if (!dates || dates.length === 0) return "";
    
    if (dates.length === 1) {
      return format(dates[0], 'yyyy년 MM월 dd일');
    }
    
    return `${dates.length}개 날짜 선택됨`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">예약 일정 변경</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">날짜 선택</label>
            {allowMultipleDates ? (
              <Calendar
                mode="multiple"
                selected={dates}
                onSelect={setDates}
                disabled={(date) => isBefore(date, tomorrow)}
                className={cn("p-3 pointer-events-auto rounded-md border")}
              />
            ) : (
              <Calendar
                mode="single"
                selected={dates?.[0]}
                onSelect={(date) => setDates(date ? [date] : [])}
                disabled={(date) => isBefore(date, tomorrow)}
                className={cn("p-3 pointer-events-auto rounded-md border")}
              />
            )}
            {dates && dates.length > 0 && (
              <div className="text-sm text-gray-500 pt-2">
                {formatSelectedDates()}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">시간 선택</label>
            <Popover open={timePopoverOpen} onOpenChange={setTimePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="grid grid-cols-2 gap-2 p-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={time === slot ? "default" : "outline"}
                      className={cn(
                        "justify-start",
                        time === slot && "bg-primary text-primary-foreground"
                      )}
                      onClick={() => {
                        setTime(slot);
                        setTimePopoverOpen(false);
                      }}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleReschedule} disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "일정 변경"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
