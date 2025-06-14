
import React, { useState } from 'react';
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import BookingProgress from './BookingProgress';

interface TimeSelectionStepProps {
  onBack: () => void;
  onNext: () => void;
  handleTime: (date: string) => void;
  handleDate: (date: Date | undefined) => void;
  handleServiceHours: (hours: number) => void;
  currentStep: "datetime";
  selectedService: string | null;
  calculatePrice: () => string;
}

const TimeSelectionStep = ({
  onBack,
  onNext,
  handleDate,
  handleTime,
  handleServiceHours,
  currentStep,
  selectedService,
  calculatePrice,
}: TimeSelectionStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number>(2);
  const [tempHours, setTempHours] = useState<number>(2);
  const [tempDate, setTempDate] = useState<Date | undefined>();
  const [tempTime, setTempTime] = useState<string>("");
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const serviceHours = [1, 2, 3, 4];

  const handleConfirmHours = () => {
    setSelectedHours(tempHours);
    handleServiceHours(tempHours);
  };

  const handleConfirmDate = () => {
    setSelectedDate(tempDate);
   handleDate(tempDate);
  };

  const handleConfirmTime = () => {
    setSelectedTime(tempTime);
    handleTime(tempTime);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <div className="p-4 px-0">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">날짜/시간을 선택해 주세요.</h1>
          
          <div className="flex items-center gap-2 text-gray-500">
            <span>교육받은 매니저님이 방문합니다.</span>
            <button className="text-primary hover:underline">
              어떤 교육을 받나요?
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  시간
                  <Info className="w-4 h-4 text-gray-400" />
                </h2>
                <p className="text-sm text-gray-500">서비스 시간: {selectedHours}시간</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    변경
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom">
                  <SheetHeader>
                    <SheetTitle>서비스 시간 선택</SheetTitle>
                  </SheetHeader>
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {serviceHours.map(hours => (
                      <Button 
                        key={hours} 
                        variant={tempHours === hours ? "default" : "outline"} 
                        onClick={() => setTempHours(hours)}
                      >
                        {hours}시간
                      </Button>
                    ))}
                  </div>
                  <div className="p-4 flex justify-end">
                    <SheetClose asChild>
                      <Button onClick={handleConfirmHours}>
                        확인
                      </Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg text-gray-500">방문 일</h3>
                  <p className="text-sm">
                    {selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일') : '날짜를 선택해주세요'}
                  </p>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      선택
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>방문 날짜 선택</SheetTitle>
                    </SheetHeader>
                    <div className="p-4">
                      <Calendar 
                        mode="single" 
                        selected={tempDate} 
                        onSelect={setTempDate} 
                        disabled={date => date < new Date()} 
                        className="rounded-md border" 
                      />
                    </div>
                    <div className="p-4 flex justify-end">
                      <SheetClose asChild>
                        <Button onClick={handleConfirmDate}>
                          확인
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg text-gray-500">방문 시간</h3>
                  <p className="text-sm">{selectedTime || '시간을 선택해주세요'}</p>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm">
                      선택
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>방문 시간 선택</SheetTitle>
                    </SheetHeader>
                    <div className="grid grid-cols-3 gap-4 p-4">
                      {timeSlots.map(time => (
                        <Button 
                          key={time} 
                          variant={tempTime === time ? "default" : "outline"} 
                          onClick={() => setTempTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                    <div className="p-4 flex justify-end">
                      <SheetClose asChild>
                        <Button onClick={handleConfirmTime}>
                          확인
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
      <BookingProgress currentStep={currentStep} selectedService={selectedService} />
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold">{calculatePrice()}</span>
            <p className="text-sm text-gray-500">자세히</p>
          </div>
          <Button 
            onClick={handleNext} 
            className="px-8" 
            size="lg" 
            disabled={!selectedDate || !selectedTime}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeSelectionStep;
