
import React from 'react';
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { format } from "date-fns";

interface DateTimeStepProps {
  date: Date | undefined;
  time: string;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onSubmit: () => void;
}

const DateTimeStep = ({
  date,
  time,
  onDateSelect,
  onTimeSelect,
  onSubmit
}: DateTimeStepProps) => {
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4">날짜/시간 선택</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-secondary">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-primary-user" />
                    {date ? format(date, 'PPP') : '날짜 선택'}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[500px]">
                <SheetHeader>
                  <SheetTitle>날짜 선택</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <Calendar mode="single" selected={date} onSelect={onDateSelect} className="mx-auto" />
                  <div className="flex justify-center mt-4">
                    <SheetClose asChild>
                      <button className="bg-primary-user text-white px-8 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        확인
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <button className="w-full flex items-center justify-between px-4 py-2 border rounded-lg hover:bg-secondary">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {time || '시간 선택'}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[400px]">
                <SheetHeader>
                  <SheetTitle>시간 선택</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-3 gap-3 p-4">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => onTimeSelect(slot)}
                      className={`p-3 rounded-lg border text-center transition-colors ${time === slot ? 'bg-primary text-white border-primary' : 'hover:bg-secondary'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <SheetClose asChild>
                    <button className="bg-primary text-white px-8 py-2 rounded-lg hover:opacity-90 transition-opacity">
                      확인
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={onSubmit}
          disabled={!date || !time}
          className="bg-primary-user text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {date && time ? '다음 단계로' : '날짜와 시간을 선택해주세요'}
        </button>
      </div>
    </div>
  );
};

export default DateTimeStep;
