
import React, { useState } from 'react';
import { ChevronDown, Check, MapPin, CalendarDays, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Define the work region options
const WORK_REGIONS = [
  { value: 'Seoul', label: '서울' },
  { value: 'Incheon', label: '인천' },
  { value: 'Gyeonggi', label: '경기도' }
];

// Define the working days
const WORKING_DAYS = [
  { value: 'monday', label: '월요일' },
  { value: 'tuesday', label: '화요일' },
  { value: 'wednesday', label: '수요일' },
  { value: 'thursday', label: '목요일' },
  { value: 'friday', label: '금요일' },
  { value: 'saturday', label: '토요일' },
  { value: 'sunday', label: '일요일' }
];

// Define the working hours
const WORKING_HOURS = Array.from({ length: 9 }, (_, i) => {
  const hour = i + 8; // Starting from 8AM
  return {
    value: hour.toString(),
    label: `${hour}:00`
  };
});

interface PreferencesProps {
  userInfo: {
    preferredWorkRegions: string[];
    preferredWorkingDays: string[];
    preferredWorkingHours: string[];
  };
  isEditing: boolean;
  handleWorkRegionChange: (region: string) => void;
  handleWorkingDayChange: (day: string) => void;
  handleWorkingHourChange: (hour: string) => void;
}

export const Preferences: React.FC<PreferencesProps> = ({
  userInfo,
  isEditing,
  handleWorkRegionChange,
  handleWorkingDayChange,
  handleWorkingHourChange,
}) => {
  const [multiSelectOpen, setMultiSelectOpen] = useState(false);
  const [hoursDropdownOpen, setHoursDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">업무 선호사항</h2>
        <Separator className="flex-1 ml-3" />
      </div>
      
      <div className="space-y-6">
        {/* Preferred Work Regions */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>선호 작업 지역</label>
          </div>
          {isEditing ? (
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setMultiSelectOpen(!multiSelectOpen)}
                className="flex justify-between items-center w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left"
                aria-haspopup="listbox"
              >
                <span className="block truncate">
                  {userInfo.preferredWorkRegions.length > 0
                    ? userInfo.preferredWorkRegions.map(region => {
                        const regionObj = WORK_REGIONS.find(r => r.value === region);
                        return regionObj ? regionObj.label : region;
                      }).join(', ')
                    : "지역을 선택하세요"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              
              {multiSelectOpen && (
                <div className="absolute mt-1 w-full z-10 bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                  {WORK_REGIONS.map((region) => (
                    <div
                      key={region.value}
                      className="relative flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        handleWorkRegionChange(region.value);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 flex items-center justify-center">
                          {userInfo.preferredWorkRegions.includes(region.value) && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <span>{region.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.preferredWorkRegions.length > 0 
                ? userInfo.preferredWorkRegions.map(region => {
                    const regionObj = WORK_REGIONS.find(r => r.value === region);
                    return regionObj ? regionObj.label : region;
                  }).join(', ')
                : "정보 없음"}
            </div>
          )}
        </div>

        {/* Preferred Working Days */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>선호 작업 요일</label>
          </div>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {WORKING_DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleWorkingDayChange(day.value)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm transition-colors",
                    userInfo.preferredWorkingDays.includes(day.value)
                      ? "bg-primary-user text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.preferredWorkingDays.length > 0 
                ? userInfo.preferredWorkingDays.map(day => {
                    const dayObj = WORKING_DAYS.find(d => d.value === day);
                    return dayObj ? dayObj.label : day;
                  }).join(', ')
                : "정보 없음"}
            </div>
          )}
        </div>

        {/* Preferred Working Hours */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>선호 작업 시간</label>
          </div>
          {isEditing ? (
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setHoursDropdownOpen(!hoursDropdownOpen)}
                className="flex justify-between items-center w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-left"
                aria-haspopup="listbox"
              >
                <span className="block truncate">
                  {userInfo.preferredWorkingHours.length > 0
                    ? userInfo.preferredWorkingHours.map(hour => {
                        const hourObj = WORKING_HOURS.find(h => h.value === hour);
                        return hourObj ? hourObj.label : hour;
                      }).join(', ')
                    : "작업 시간을 선택하세요"}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
              
              {hoursDropdownOpen && (
                <div className="absolute mt-1 w-full z-10 bg-white shadow-lg max-h-60 rounded-md py-1 overflow-auto">
                  {WORKING_HOURS.map((hour) => (
                    <div
                      key={hour.value}
                      className="relative flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        handleWorkingHourChange(hour.value);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 flex items-center justify-center">
                          {userInfo.preferredWorkingHours.includes(hour.value) && (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <span>{hour.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.preferredWorkingHours.length > 0 
                ? userInfo.preferredWorkingHours.map(hour => {
                    const hourObj = WORKING_HOURS.find(h => h.value === hour);
                    return hourObj ? hourObj.label : hour;
                  }).join(', ')
                : "정보 없음"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
