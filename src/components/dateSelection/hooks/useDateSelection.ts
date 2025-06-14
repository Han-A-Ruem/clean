import { useState, useEffect } from 'react';
import { format, getDay, addDays, addWeeks, addMonths } from 'date-fns';

// Helper function to map Korean day names to day indices (0-6, where 0 is Sunday)
const mapKoreanDayToIndex = (koreanDay: string): number => {
  const dayMapping: Record<string, number> = {
    '일': 0, // Sunday
    '월': 1, // Monday
    '화': 2, // Tuesday
    '수': 3, // Wednesday
    '목': 4, // Thursday
    '금': 5, // Friday
    '토': 6  // Saturday
  };
  return dayMapping[koreanDay] || -1;
};

export type Tabs = 'once_weekly' | 'multiple_weekly' | 'biweekly' | 'multiple_biweekly' | 'once_monthly' | 'multiple_monthly'

export const useDateSelection = () => {
  const [activeTab, setActiveTab] = useState<Tabs>('once_weekly');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [serviceHours, setServiceHours] = useState<string>("4시간");
  const [serviceHoursTemp, setServiceHoursTemp] = useState<string>("4시간");
  const [visitTime, setVisitTime] = useState<string | null>(null);
  const [visitTimeTemp, setVisitTimeTemp] = useState<string | null>(null);
  const [isServiceHoursOpen, setIsServiceHoursOpen] = useState(false);
  const [isVisitTimeOpen, setIsVisitTimeOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateList, setSelectedDateList] = useState<Date[]>([]);
  const [frequencyType, setFrequencyType] = useState<Tabs>('once_weekly');
  const [isFrequencyOpen, setIsFrequencyOpen] = useState(false);

  useEffect(() => {
    setSelectedDateList([]);
    setStartDate(null);
  }, [selectedDays, activeTab]);

  const handleTabChange = (tab: Tabs) => {
    setActiveTab(tab);
    setSelectedDays([]);
    setSelectedDateList([]);
  };

  const handleDateSelection = (day: string) => {
    if (['multiple_weekly', 'multiple_biweekly', 'multiple_monthly'].includes(activeTab)) {
      if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      } else {
        setSelectedDays([...selectedDays, day]);
      }
    } else {
      setSelectedDays([day]);
    }
  };

  const handleServiceHoursSelect = (hours: string) => {
    setServiceHoursTemp(hours);
  };

  const confirmServiceHours = () => {
    setServiceHours(serviceHoursTemp);
    setIsServiceHoursOpen(false);
    
    const hoursNum = parseInt(serviceHoursTemp.replace(/[^0-9]/g, ''));
    if (!isNaN(hoursNum)) {
      console.log(`Service hours updated to: ${hoursNum} hours`);
    }
  };

  const handleVisitTimeSelect = (time: string) => {
    setVisitTimeTemp(time);
  };

  const confirmVisitTime = () => {
    setVisitTime(visitTimeTemp);
    setIsVisitTimeOpen(false);
    
    if (visitTimeTemp) {
      console.log(`Visit time updated to: ${visitTimeTemp}`);
    }
  };

  const handleStartDateSelect = (dates: Date[]) => {
    if (dates.length > 0) {
      setStartDate(dates[0]);
      
      const generatedDates = generateDatesFromFrequency(dates[0], activeTab, selectedDays);
      setSelectedDateList(generatedDates);
      
      const formattedDates = dates.map(date => format(date, 'yyyy-MM-dd'));
      console.log('Selected dates:', formattedDates);
    }
  };

  const generateDatesFromFrequency = (
    startDate: Date, 
    frequency: Tabs, 
    selectedDays: string[]
  ): Date[] => {
    if (!startDate || selectedDays.length === 0) return [];
    
    const dates: Date[] = [];
    const dayIndices = selectedDays.map(day => mapKoreanDayToIndex(day));
    
    if (frequency === 'once_weekly') {
      return [startDate];
    }
    
    const endDate = addMonths(startDate, 3);
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const currentDayIndex = getDay(currentDate);
      
      if (dayIndices.includes(currentDayIndex)) {
        dates.push(new Date(currentDate));
      }
      
      switch (frequency) {
        case 'multiple_weekly':
          currentDate = addDays(currentDate, 1);
          break;
        case 'biweekly':
          if (dates.length > 0) {
            currentDate = addWeeks(currentDate, 2);
          } else {
            currentDate = addDays(currentDate, 1);
          }
          break;
        case 'multiple_biweekly':
          if (dates.length > 0 && dates.length % selectedDays.length === 0) {
            currentDate = addWeeks(findFirstDayOfNextPeriod(currentDate, dayIndices[0]), 2);
          } else {
            currentDate = addDays(currentDate, 1);
          }
          break;
        case 'once_monthly':
          if (dates.length > 0) {
            const nextMonthDate = new Date(currentDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            currentDate = findClosestDateForDay(nextMonthDate, dayIndices[0]);
          } else {
            currentDate = addDays(currentDate, 1);
          }
          break;
        case 'multiple_monthly':
          if (dates.length > 0 && dates.length % selectedDays.length === 0) {
            const nextMonthDate = new Date(currentDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            currentDate = findClosestDateForDay(nextMonthDate, dayIndices[0]);
          } else {
            currentDate = addDays(currentDate, 1);
          }
          break;
        default:
          currentDate = addDays(currentDate, 1);
      }
    }
    
    return dates.sort((a, b) => a.getTime() - b.getTime());
  };

  const findFirstDayOfNextPeriod = (currentDate: Date, firstDayIndex: number): Date => {
    let nextDate = new Date(currentDate);
    while (getDay(nextDate) !== firstDayIndex) {
      nextDate = addDays(nextDate, 1);
    }
    return nextDate;
  };

  const findClosestDateForDay = (date: Date, dayIndex: number): Date => {
    let current = new Date(date);
    let daysToAdd = (dayIndex - getDay(current) + 7) % 7;
    return addDays(current, daysToAdd);
  };

  const isSameDayAsSelected = (date: Date, dayIndex: number): boolean => {
    return getDay(date) === dayIndex;
  };

  const handleOpenCalendar = () => {
    if (selectedDays.length > 0) {
      setIsCalendarOpen(true);
    } else {
      alert('먼저 요일을 선택해주세요');
    }
  };

  const formatSelectedDatesDisplay = () => {
    if (selectedDateList.length === 0) return '선택';
    
    if (activeTab === 'once_weekly' && selectedDateList.length === 1) {
      return format(selectedDateList[0], 'yyyy년 MM월 dd일');
    } else {
      return `${selectedDateList.length}개 날짜 선택됨`;
    }
  };

  const getServiceHoursAsNumber = (): number => {
    const hoursNum = parseInt(serviceHours.replace(/[^0-9]/g, ''));
    return isNaN(hoursNum) ? 4 : hoursNum;
  };

  const getPrimaryDate = (): Date | null => {
    return selectedDateList.length > 0 ? selectedDateList[0] : null;
  };

  const getFrequencyDescription = (): string => {
    switch (frequencyType) {
      case 'once_weekly': return '주 1회';
      case 'multiple_weekly': return '주 여러 회';
      case 'biweekly': return '격주 1회';
      case 'multiple_biweekly': return '격주 여러 회';
      case 'once_monthly': return '월 1회';
      case 'multiple_monthly': return '월 여러 회';
      default: return '단일 예약';
    }
  };

  return {
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
    frequencyType,
    isFrequencyOpen,
    setActiveTab,
    setSelectedDays,
    setServiceHours,
    setServiceHoursTemp,
    setVisitTime,
    setVisitTimeTemp,
    setIsServiceHoursOpen,
    setIsVisitTimeOpen,
    setStartDate,
    setIsCalendarOpen,
    setSelectedDateList,
    setFrequencyType,
    setIsFrequencyOpen,
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
    getPrimaryDate,
    mapKoreanDayToIndex,
    getFrequencyDescription,
    findClosestDateForDay
  };
};
