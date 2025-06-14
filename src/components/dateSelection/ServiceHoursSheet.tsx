
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import TimeSelectionAlert from '@/components/TimeSelectionAlert';
interface ServiceHoursSheetProps {
  serviceHours: string;
  serviceHoursTemp: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onServiceHoursSelect: (hours: string) => void;
  onConfirm: () => void;
  areaThreshold?: number | null;
}

const ServiceHoursSheet: React.FC<ServiceHoursSheetProps> = ({
  serviceHours,
  serviceHoursTemp,
  isOpen,
  onOpenChange,
  onServiceHoursSelect,
  onConfirm,
  areaThreshold
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  
  // Get all available service hours
  const allServiceHours = ["2시간", "3시간", "4시간", "5시간", "6시간", "7시간", "8시간"];
  
  // Filter service hours based on area threshold
  const availableServiceHours = areaThreshold && areaThreshold >= 30
    ? allServiceHours.filter(hour => parseInt(hour) >= 4)
    : allServiceHours;
  
  const handleServiceHoursSelect = (hours: string) => {
    const selectedHours = parseInt(hours);
    const areaThresh = areaThreshold ?? 0;
    
    // Check if selection is allowed based on area threshold
    if ((areaThresh >= 30 && selectedHours < 4) || 
        (areaThresh < 30 && selectedHours < 2)) { // Minimum 2 hours for any service
      setAlertOpen(true);
      return;
    }
    
    onServiceHoursSelect(hours);
  };
  
  return (
    <div className="flex justify-between items-center py-4 border-b">
      <div>
        <h3 className="text-lg font-medium">{serviceHours}</h3>
        <p className="text-gray-500 text-sm">서비스 시간</p>
      </div>
      <SheetTrigger asChild>
        <button className="text-primary-user font-medium">변경</button>
      </SheetTrigger>
      
      <SheetContent side="bottom" className="h-[50vh]">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-center">서비스 시간 선택</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {allServiceHours.map((hours) => {
            const hourValue = parseInt(hours);
            const isDisabled = areaThreshold && areaThreshold >= 30 && hourValue < 4;
            
            return (
              <Button
                key={hours}
                variant={serviceHoursTemp === hours ? "default" : "outline"}
                className={cn(
                  "w-full py-6 text-lg",
                  serviceHoursTemp === hours ? "bg-primary-user hover:bg-primary-user" : "",
                  isDisabled ? "opacity-50 cursor-not-allowed" : ""
                )}
                // disabled={isDisabled}
                onClick={() => handleServiceHoursSelect(hours)}
              >
                {hours}
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
      
      <TimeSelectionAlert 
        open={alertOpen} 
        onOpenChange={setAlertOpen} 
        areaThreshold={areaThreshold}
      />
    </div>
  );
};

export default ServiceHoursSheet;
