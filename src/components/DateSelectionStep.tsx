
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TabSelector from './dateSelection/TabSelector';
import DaySelector from './dateSelection/DaySelector';
import ServiceHoursSheet from './dateSelection/ServiceHoursSheet';
import VisitTimeSheet from './dateSelection/VisitTimeSheet';
import SelectedDateDisplay from './dateSelection/SelectedDateDisplay';
import SelectedTimeDisplay from './dateSelection/SelectedTimeDisplay';
import CalendarDatePicker from './dateSelection/CalendarDatePicker';
import { Tabs, useDateSelection } from './dateSelection/hooks/useDateSelection';
import { ReservationFormData } from '@/types/reservation';
import { PageHeader } from './Utils';
import { toast } from "sonner";
import { useNotification } from '@/contexts/NotificationContext';
import { formatKoreanWon } from '@/utils/formatters';

interface DateSelectionStepProps {
  onBack: () => void;
  onNext: (dates: Date[] | string, time?: string, serviceHours?: number) => void;
  setReservationData?: (data: Partial<ReservationFormData>) => void;
  reservationData: ReservationFormData;
}

const DateSelectionStep = ({
  onBack,
  onNext,
  setReservationData,
  reservationData
}: DateSelectionStepProps) => {
  const {
    activeTab,
    selectedDays,
    serviceHours,
    serviceHoursTemp,
    visitTime,
    visitTimeTemp,
    isServiceHoursOpen,
    isVisitTimeOpen,
    startDate,
    isCalendarOpen,
    selectedDateList,
    handleTabChange,
    handleDateSelection,
    handleServiceHoursSelect,
    confirmServiceHours,
    handleVisitTimeSelect,
    confirmVisitTime,
    handleStartDateSelect,
    handleOpenCalendar,
    formatSelectedDatesDisplay,
    getServiceHoursAsNumber,
    setIsServiceHoursOpen,
    setIsVisitTimeOpen,
    setIsCalendarOpen
  } = useDateSelection();
  
  // Add state to track validation and highlight fields
  const [isDaysPulsing, setIsDaysPulsing] = useState(false);
  const [isDatesPulsing, setIsDatesPulsing] = useState(false);
  const [isTimePulsing, setIsTimePulsing] = useState(false);
  const [isCleanerTypePulsing, setIsCleanerTypePulsing] = useState(false);
  const { updateConfig } = useNotification();
  
  useEffect(() => {
    // Configure notifications for this page
    updateConfig({
      position: "top-center",
      offset: "5rem"
    });
  }, []);
  const handleNext = () => {
    const isOneTime = reservationData.reservation_type === 'onetime';
    const isValid = selectedDays.length > 0 && selectedDateList.length > 0 && visitTime && (isOneTime || reservationData.cleaner_type);
  
    if (isValid) {
      onNext(selectedDateList, visitTime, getServiceHoursAsNumber());
    } else {
      // Show validation highlights
      setIsDaysPulsing(selectedDays.length === 0);
      setIsDatesPulsing(selectedDateList.length === 0);
      setIsTimePulsing(!visitTime);
      if (!isOneTime) {
        setIsCleanerTypePulsing(!reservationData.cleaner_type);
      }
  
      // Reset animations after 2 seconds
      setTimeout(() => {
        setIsDaysPulsing(false);
        setIsDatesPulsing(false);
        setIsTimePulsing(false);
        if (!isOneTime) {
          setIsCleanerTypePulsing(false);
        }
      }, 2000);
    }
  };
  

  useEffect(() => {
    console.log("ReservationProvider mounted!");
    if (setReservationData) {
      setReservationData({
        reservation_type: reservationData.reservation_type == 'onetime' ?reservationData.reservation_type: activeTab ,
        duration: `${parseInt(serviceHoursTemp.replace("시간", ""), 10)}:00`,
      });
    }
    // Simulate fetching initial data

    return () => {
      console.log("ReservationProvider unmounted!"); // Cleanup if needed
    };
  }, []); 

  const onHandleTabChange = (tab: Tabs) => {
    handleTabChange(tab);
    console.log('tab', tab)
    if (setReservationData) {
      setReservationData({
        reservation_type: tab,
      });
    }
  }

  const onConfirmVisitTime = () => {
    confirmVisitTime();
    console.log({mgs:'vissitTime' , visitTimeTemp})
    if (setReservationData && visitTimeTemp) {
      setReservationData({
        time: visitTimeTemp
      });
    }
    // Clear the time validation highlight when time is selected
    setIsTimePulsing(false);
  }

  const onConfirmServiceHours = () => {
    confirmServiceHours();
    if (setReservationData) {
      setReservationData({
        duration: `${parseInt(serviceHoursTemp.replace("시간", ""), 10)}:00`,
      });
    }
  }

  const onHandleDateSelect = (dates: Date[]) => {
    handleStartDateSelect(dates)
    if (setReservationData) {
      setReservationData({
        date: dates
      });
    }
    // Clear the dates validation highlight when dates are selected
    setIsDatesPulsing(false);
  }

  const onHandleDaySelect = (day: string) => {
    handleDateSelection(day);
    console.log({mgs:'s', selectedDays})
    if (setReservationData) {
      setReservationData({
        days: selectedDays
      });
    }
    // Clear the days validation highlight when days are selected
    setIsDaysPulsing(false);
  }

  useEffect(() => {
    // Set minimum 4 hours service for areas >= 30
    if (reservationData.area_thresh && reservationData.area_thresh >= 30 && getServiceHoursAsNumber() < 4) {
      handleServiceHoursSelect("4시간");
      confirmServiceHours();
    }
    window.scrollTo(0, 0);
  }, [reservationData.area_thresh]);

  return (
    <div className="min-h-screen bg-white relative pb-24">
      <PageHeader title=''/>

      <div className="px-4 pt-4">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-center">전문가 매칭</h1>
          

          {reservationData.reservation_type != 'onetime' && <TabSelector 
            activeTab={activeTab}
            onTabChange={onHandleTabChange} 
          />}
          
          <p className="text-lg text-center">
            고객님은 전문 클리너님이 방문합니다.
          </p>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">날짜/시간을 선택해 주세요.</h2>
            
          
              <DaySelector 
              pulse={`
                "transition-all duration-500" ${isDaysPulsing ? "animate-pulse rounded-lg ring-2 ring-primary-user" : ""}
             `}
                selectedDays={selectedDays}
                activeTab={activeTab}
                onDaySelect={onHandleDaySelect}
              />
            
            <Sheet open={isServiceHoursOpen} onOpenChange={setIsServiceHoursOpen}>
              <ServiceHoursSheet 
                serviceHours={serviceHours}
                serviceHoursTemp={serviceHoursTemp}
                isOpen={isServiceHoursOpen}
                onOpenChange={setIsServiceHoursOpen}
                onServiceHoursSelect={handleServiceHoursSelect}
                onConfirm={onConfirmServiceHours}
                areaThreshold={reservationData.area_thresh}
              />
            </Sheet>
            
            <Sheet open={isVisitTimeOpen} onOpenChange={setIsVisitTimeOpen}>
              <VisitTimeSheet 
                  pulse={`
                    "transition-all duration-500" ${isTimePulsing ? "animate-pulse rounded-sm px-1 ring-2 ring-primary-user" : ""}
                 `}
                visitTime={visitTime}
                visitTimeTemp={visitTimeTemp}
                isOpen={isVisitTimeOpen}
                onOpenChange={setIsVisitTimeOpen}
                onVisitTimeSelect={handleVisitTimeSelect}
                onConfirm={onConfirmVisitTime}
                serviceHours={getServiceHoursAsNumber()}
              />
            </Sheet>
            
            {/* Add the SelectedTimeDisplay component here, between visit time and start date */}
         
              {reservationData.reservation_type != 'onetime' && visitTime && (
                <SelectedTimeDisplay 
                pulse={`
                  "transition-all duration-500" ${isCleanerTypePulsing ? "animate-pulse rounded-lg ring-2 ring-primary-user" : ""}
               `}
                  visitTime={visitTime} 
                  onSelectClenerType={setReservationData}
                />
              )}
              {/* do not bring this code back just leave it as a comment */}
              {/* {!visitTime && (
                <div className="flex justify-between items-center py-4 border-b">
                  <div>
                    <h3 className="text-lg font-medium">방문 시간</h3>
                    <p className="text-gray-500 text-sm">방문 시간을 선택해주세요</p>
                  </div>
                  <button 
                    className={cn(`text-primary-user font-medium  transition-all duration-500 ${isTimePulsing ? "animate-pulse rounded-sm px-1 ring-2 ring-primary-user" : "" } `)}
                    onClick={() => setIsVisitTimeOpen(true)}
                  >
                    선택
                  </button>
                </div>
              )} */}
        
              <div className="flex justify-between items-center py-4 border-b">
                <div>
                  <h3 className="text-lg font-medium">시작일</h3>
                  <p className="text-gray-500 text-sm">
                    {formatSelectedDatesDisplay()}
                  </p>
                </div>
                <button 
                  className={cn(
                    "text-primary-user font-medium",
                    selectedDays.length === 0 ? "opacity-50" : "",
                   
                      "transition-all duration-500", isDatesPulsing ? "animate-pulse rounded-sm px-1 ring-2 ring-primary-user" : ""
                   
                  )}
                  onClick={handleOpenCalendar}
                >
                  선택
                </button>
              </div>
            
            <SelectedDateDisplay selectedDateList={selectedDateList} />
          </div>
        </div>
      </div>

      <CalendarDatePicker
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelect={onHandleDateSelect}
        selectedDays={selectedDays}
        activeTab={activeTab}
        initialDate={startDate || undefined}
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold">{formatKoreanWon(reservationData.amount)}</span>
            <p className="text-sm text-gray-500">자세히</p>
          </div>
          <Button 
            onClick={handleNext} 
            className={cn(
              "px-8 bg-primary-user hover:bg-primary-user",
              (selectedDays.length === 0 || !visitTime || selectedDateList.length === 0) ? "animate-none" : "",
              (isDaysPulsing || isDatesPulsing || isTimePulsing) ? "animate-pulse ring-2 ring-primary-user" : ""
            )}
            size="lg"
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DateSelectionStep;
