
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InterviewTimeSlotsProps {
  date: Date;
  location: string;
  onSelectTimeSlot: (timeSlot: string, scheduleId: string) => void;
}

const InterviewTimeSlots: React.FC<InterviewTimeSlotsProps> = ({ date, location, onSelectTimeSlot }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  
  const { data: availableTimeSlots = [], isLoading, error } = useQuery({
    queryKey: ['interviewTimeSlots', date, location],
    queryFn: async () => {
      const dateString = date.toISOString().split('T')[0];
      
      // Fetch existing schedules for the selected date and location
      const { data, error } = await supabase
        .from('interview_schedules')
        .select('id, time_slot, max_participants, interview_participants(count)')
        .eq('date', dateString)
        .eq('location', location);
      
      if (error) throw error;
      
      // If we have schedules, filter and annotate them
      if (data && data.length > 0) {
        return data.map(schedule => {
          const participantCount = schedule.interview_participants[0]?.count || 0;
          const isAvailable = participantCount < schedule.max_participants;
          
          return {
            scheduleId: schedule.id,
            time: schedule.time_slot,
            available: isAvailable,
            reason: isAvailable ? `${participantCount}/${schedule.max_participants} 예약됨` : '마감됨'
          };
        });
      }
      
      return [];
    },
    enabled: !!date && !!location
  });
  
  const handleSelectTimeSlot = (timeSlot: string, scheduleId: string) => {
    setSelectedTimeSlot(timeSlot);
    onSelectTimeSlot(timeSlot, scheduleId);
  };
  
  if (isLoading) {
    return <div className="text-center py-8">시간대 불러오는 중...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center py-4">시간대를 불러오는데 실패했습니다.</div>;
  }
  
  if (availableTimeSlots.length === 0) {
    return <div className="text-center py-8">선택한 날짜와 장소에 가능한 시간대가 없습니다.</div>;
  }
  
  // Count available slots
  const availableCount = availableTimeSlots.filter(slot => slot.available).length;
  
  // Sort time slots
  const sortedTimeSlots = [...availableTimeSlots].sort((a, b) => {
    const timeA = parseInt(a.time.split(':')[0]);
    const timeB = parseInt(b.time.split(':')[0]);
    return timeA - timeB;
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">
          시간 선택 
          <span className="text-muted-foreground text-sm ml-2">
            {availableCount} of {availableTimeSlots.length} 시간대 가능
          </span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sortedTimeSlots.map((slot, index) => (
          <div key={index}>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 transition-all",
                slot.available ? (
                  selectedTimeSlot === slot.time 
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-primary/10 hover:border-primary"
                ) : "opacity-50 cursor-not-allowed"
              )}
              onClick={() => slot.available && handleSelectTimeSlot(slot.time, slot.scheduleId)}
              disabled={!slot.available}
            >
              <Clock className="mr-2 h-4 w-4" />
              {slot.time}
              {!slot.available && (
                <span className="ml-1 text-xs">(마감)</span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewTimeSlots;
