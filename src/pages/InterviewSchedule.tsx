
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/Utils';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useCleanerRegistration } from '@/contexts/CleanerRegistrationContext';

// Define proper types for interview schedules
interface InterviewSchedule {
  id: string;
  date: string;
  location: string;
  time_slot: string;
  max_participants: number;
  available_slots: number;
}

const InterviewSchedule = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userData } = useUser();
  const { data, setData } = useCleanerRegistration();

  const [interviews, setInterviews] = useState<Record<string, InterviewSchedule[]>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [participantInfo, setParticipantInfo] = useState({
    name: userData?.name || '',
    phone: userData?.phone || '',
    email: user?.email || '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch available interview dates
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const { data, error } = await supabase
          .from('interview_schedules')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        // Get the current participants to check availability
        const { data: participants, error: participantsError } = await supabase
          .from('interview_participants')
          .select('schedule_id');

        if (participantsError) throw participantsError;

        // Calculate available slots for each schedule
        const schedulesWithAvailability = data.map(schedule => {
          const participantsCount = participants.filter(p => p.schedule_id === schedule.id).length;
          return {
            ...schedule,
            available_slots: schedule.max_participants - participantsCount
          };
        });

        const groupedSchedules = schedulesWithAvailability.reduce((acc, item) => {
          acc[item.date] = acc[item.date] || [];
          acc[item.date].push(item);
          return acc;
        }, {});

        setInterviews(groupedSchedules);
      } catch (error) {
        console.error("Error fetching interview schedules:", error);
        toast({
          variant: "destructive",
          title: "오류 발생",
          description: "일정을 불러오는데 실패했습니다.",
        });
      }
    };

    fetchAvailableDates();
  }, [toast]);

  // Function to get day of week in Korean
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  // Handle submitting the interview registration
  const handleSubmit = async () => {
    if (!selectedDate || !selectedRegion || !selectedTime || !selectedScheduleId) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "모든 필수 정보를 입력해주세요.",
      });
      return;
    }

    setSubmitting(true);


    setData({name: userData?.name || "",
      schedule_id: selectedScheduleId,
      user_id: user?.id || null,
      status: 'confirmed',
      date: selectedDate,
      time_slot: selectedTime,
    });

    navigate('/onboarding/location');

    return;

    try {
      // Find the selected schedule
      const selectedSchedule = interviews[selectedDate].find(
        schedule => schedule.id === selectedScheduleId
      );

      if (!selectedSchedule) {
        throw new Error("선택한 일정을 찾을 수 없습니다.");
      }

      if (selectedSchedule.available_slots <= 0) {
        throw new Error("선택한 시간은 이미 정원이 찼습니다.");
      }

      // Register the participant
      const { data, error } = await supabase
        .from('interview_participants')
        .insert({
          name: userData?.name || "",
          phone: userData?.phone || '',
          email: user?.email || null,
          schedule_id: selectedScheduleId,
          user_id: user?.id || null,
          status: 'confirmed'
        });

      if (error) throw error;

      // Update available slots
      const newAvailableSlots = Math.max(0, selectedSchedule.available_slots - 1);
      
      // const { error: updateError } = await supabase
      //   .from('interview_schedules')
      //   .update({ available_slot: newAvailableSlots })
      //   .eq('id', selectedScheduleId);

      // if (updateError) throw updateError;

      // Update the local state to reflect changes
      const updatedInterviews = { ...interviews };
      updatedInterviews[selectedDate] = updatedInterviews[selectedDate].map(schedule => {
        if (schedule.id === selectedScheduleId) {
          return { ...schedule, available_slots: newAvailableSlots };
        }
        return schedule;
      });
      
      setInterviews(updatedInterviews);

      toast({
        title: "예약 완료",
        description: "인터뷰 예약이 성공적으로 완료되었습니다.",
      });

      // Navigate back to home page or confirmation page
      navigate('/');
    } catch (error) {
      console.error("Error submitting interview reservation:", error);
      toast({
        variant: "destructive",
        title: "예약 실패",
        description: error.message || "인터뷰 예약 중 오류가 발생했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique regions for the selected date
  const getRegionsForDate = (date) => {
    if (!interviews[date]) return [];
    return [...new Set(interviews[date].map(item => item.location))];
  };

  // Get time slots for selected date and region
  const getTimeSlotsForRegion = (date, region) => {
    if (!interviews[date]) return [];
    return interviews[date].filter(item => item.location === region);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slotId: string, timeSlot: string) => {
    setSelectedTime(timeSlot);
    setSelectedScheduleId(slotId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* <PageHeader title="인터뷰 일정 예약" /> */}
      <h1 className="text-xl font-semibold text-gray-800 flex-1 px-4 py-4  text-center">{'인터뷰 일정 예약'}</h1>
      <div className='px-4'>


      {/* Selected Schedule Preview */}
      {selectedDate && selectedRegion && selectedTime && (
        <Card className="mb-6 bg-blue-50 mt-1">
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-2">선택한 일정</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-sm text-gray-500">날짜</span>
                <p>{selectedDate} ({getDayOfWeek(selectedDate)})</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">지역</span>
                <p>{selectedRegion}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">시간</span>
                <p>{selectedTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6 mt-4">
        {Object.keys(interviews).length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">현재 예약 가능한 인터뷰 일정이 없습니다.</p>
          </div>
        ) : (
          Object.keys(interviews).map((date) => {
            const dayNumber = date.split('-')[2]; // Extract day from date (YYYY-MM-DD)
            const dayOfWeek = getDayOfWeek(date);
            const regions = getRegionsForDate(date);

            return (
              <div
                key={date}
                className={`shadow-sm border rounded-lg bg-white ${selectedDate === date ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => {
                  if(selectedDate === date) return;
                  setSelectedDate(date);
                  setSelectedRegion(null);
                  setSelectedTime(null);
                  setSelectedScheduleId(null);
                }}
              >
                <div className="flex flex-row items-center  justify-around p-4">
                  {/* Date section */}
                  <div className="flex items-center justify-center p-4 md:w-1/5">
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-bold">{dayNumber}</span>
                      <span className={`text-xl px-4 py-1 rounded-full ${dayOfWeek === 'Sun' ? 'bg-red-300' : dayOfWeek === 'Sat' ? 'bg-blue-300' : 'bg-pink-300'}`}>
                        {dayOfWeek}
                      </span>
                    </div>
                  </div>

                  {/* Region selection */}
                  <div className="p-2">
                    <Select
                      value={selectedDate === date ? selectedRegion || '' : ''}
                      onValueChange={(value) => {
                        setSelectedRegion(value);
                        setSelectedTime(null);
                        setSelectedScheduleId(null);
                      }}
                      disabled={selectedDate !== date}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="지역 선택" />
                      </SelectTrigger>
                      <SelectContent className='bg-white'>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Time slots */}
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {getTimeSlotsForRegion(date, selectedRegion).map((slot) => (
                      <button
                        key={slot.id}
                        className={`px-4 py-2 rounded-full text-sm 
                          ${selectedScheduleId === slot.id
                            ? 'bg-blue-500 text-white'
                            : slot.available_slots <= 0
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (slot.available_slots > 0) {
                            handleTimeSlotSelect(slot.id, slot.time_slot);
                          }
                        }}
                        disabled={slot.available_slots <= 0}
                      >
                        {slot.time_slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full mt-6 bg-primary-cleaner hover:bg-primary-cleaner/90 text-white"
        disabled={submitting || !selectedDate || !selectedRegion || !selectedTime || !selectedScheduleId}
      >
        {submitting ? '예약 중...' : '인터뷰 예약하기'}
      </Button>
    </div>

    </div>

  );
};

export default InterviewSchedule;
