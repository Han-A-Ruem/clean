
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface InterviewScheduleFormProps {
  editSchedule: any | null;
  onCancel: () => void;
  onSaved: () => void;
}

const locations = [
  { value: '홍대', label: '홍대' },
  { value: '을지로입구', label: '을지로입구' },
  { value: '뚝섬(서울숲)', label: '뚝섬(서울숲)' },
  { value: '강남', label: '강남' },
  { value: '충무로', label: '충무로' },
  { value: '영등포', label: '영등포' }
];

const timeSlots = [
  { value: '09:00', label: '9:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
];

const selectableTimes = ['10:00', '11:00', '13:00', '14:00'];

const InterviewScheduleForm: React.FC<InterviewScheduleFormProps> = ({ 
  editSchedule, 
  onCancel,
  onSaved
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState<string>('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [maxParticipants, setMaxParticipants] = useState<number>(3);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (editSchedule) {
      setSelectedDate(editSchedule.date ? new Date(editSchedule.date) : undefined);
      setLocation(editSchedule.location);
      setSelectedTimeSlots([editSchedule.time_slot]);
      setMaxParticipants(editSchedule.max_participants);
    } else {
      // Default to selecting all allowed time slots
      setSelectedTimeSlots(selectableTimes);
    }
  }, [editSchedule]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    setSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(slot => slot !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
  };
  
  const getSelectedTimesText = () => {
    if (selectedTimeSlots.length === 0) return "시간대 선택";
    if (editSchedule) return timeSlots.find(t => t.value === selectedTimeSlots[0])?.label || "시간대 선택";
    
    if (selectedTimeSlots.length === selectableTimes.length) return "모든 시간 선택됨";
    return `${selectedTimeSlots.length}개 시간대 선택됨`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !location || selectedTimeSlots.length === 0) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "날짜, 장소, 그리고 최소한 하나의 시간대를 선택해주세요.",
      });
      return;
    }

    setLoading(true);

    try {
      if (editSchedule) {
        const { error } = await supabase
          .from('interview_schedules')
          .update({
            date: format(selectedDate, 'yyyy-MM-dd'),
            location,
            time_slot: selectedTimeSlots[0], 
            max_participants: maxParticipants
          })
          .eq('id', editSchedule.id);
          
        if (error) throw error;
        
        toast({
          title: "수정 완료",
          description: "인터뷰 일정이 수정되었습니다.",
        });
      } else {
        const schedulesToInsert = selectedTimeSlots.map(timeSlot => ({
          date: format(selectedDate, 'yyyy-MM-dd'),
          location,
          time_slot: timeSlot,
          max_participants: maxParticipants
        }));
        
        const { error } = await supabase
          .from('interview_schedules')
          .insert(schedulesToInsert);
          
        if (error) throw error;
        
        toast({
          title: "등록 완료",
          description: `${schedulesToInsert.length}개의 인터뷰 시간대가 등록되었습니다.`,
        });
      }
      
      resetForm();
      onSaved();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "오류 발생",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate(undefined);
    setLocation('');
    setSelectedTimeSlots(selectableTimes);
    setMaxParticipants(3);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{editSchedule ? '인터뷰 일정 수정' : '새 인터뷰 일정 추가'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>날짜</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "날짜 선택"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  className='bg-white'
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={editSchedule ? undefined : {
                    before: new Date()
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">장소</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder="장소 선택" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>시간 {editSchedule ? '' : '(여러 시간대 선택 가능)'}</Label>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  disabled={editSchedule !== null}
                >
                  {getSelectedTimesText()}
                  <Check className={cn("ml-2 h-4 w-4", selectedTimeSlots.length > 0 ? "opacity-100" : "opacity-0")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full bg-white">
                <DropdownMenuLabel>시간대 선택</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {timeSlots
                  .map((timeSlot) => (
                    <DropdownMenuCheckboxItem
                      key={timeSlot.value}
                      checked={selectedTimeSlots.includes(timeSlot.value)}
                      onCheckedChange={() => !editSchedule && handleTimeSlotToggle(timeSlot.value)}
                      disabled={editSchedule !== null}
                    >
                      {timeSlot.label}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">최대 참가자 수</Label>
            <Input
              id="maxParticipants"
              type="number"
              min={1}
              max={10}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={loading || !selectedDate || !location || selectedTimeSlots.length === 0}>
            {loading ? "처리 중..." : editSchedule ? "수정" : "추가"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InterviewScheduleForm;
