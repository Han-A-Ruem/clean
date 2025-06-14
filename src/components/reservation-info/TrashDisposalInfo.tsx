import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Check, Apple, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReservationFormData } from "@/types/reservation";

interface TrashDisposalInfoProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
}

const TRASH_TYPES = ["recyclable", "general", "food"];

const TrashDisposalInfo: React.FC<TrashDisposalInfoProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
}) => {
  const [disposeTypes, setDisposeTypes] = useState<string[]>(customerInfo.dispose_types || []);
  const [disposalMethods, setDisposalMethods] = useState({
    recyclable: customerInfo.recycle_message || "",
    general: customerInfo.general_message || "",
    food: customerInfo.food_message || ""
  });

  useEffect(() => {
    setDisposeTypes(customerInfo.dispose_types || []);
  },[])

  // useEffect(() => {
  //   setDisposeTypes(customerInfo.dispose_types || []);
  //   setDisposalMethods({
  //     recyclable: customerInfo.recycle_message || "",
  //     general: customerInfo.general_message || "",
  //     food: customerInfo.food_message || ""
  //   });
  // }, [customerInfo]);

  const toggleTrashOption = (type: string) => {
    setDisposeTypes(prev => {
      const updatedTypes = prev.includes(type) 
        ? prev.filter(t => t !== type)  // Remove if already exists
        : [...prev, type];  // Add if not exists
  
      console.log("Updated dispose_types:", updatedTypes); // Debugging log
    
      onCustomerInfoChange({ dispose_types: updatedTypes });
      return updatedTypes; // Correctly update state
    });


  };

  const handleDisposalMethodChange = (type: string, value: string) => {

    setDisposalMethods(prev => ({
      ...prev,
      [type]: value
    }));
    onCustomerInfoChange({
      recycle_message: disposalMethods.recyclable,
      general_message: disposalMethods.general,
      food_message: disposalMethods.food,
    })
    
  };

  return (
    <div className={cn("pt-4", className)}>
      <h2 className="text-xl font-semibold mb-4">쓰레기 배출 방법</h2>
      <div className="space-y-3">
        {TRASH_TYPES.map(type => (
          <div key={type} className="space-y-3">
            <button
              type="button"
              onClick={() => toggleTrashOption(type)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {type === "recyclable" && <RotateCcw className="w-5 h-5 text-gray-600" />}
                  {type === "general" && <Trash2 className="w-5 h-5 text-gray-600" />}
                  {type === "food" && <Apple className="w-5 h-5 text-gray-600" />}
                </div>
                <span>
                  {type === "recyclable" ? "재활용 분리수거" : type === "general" ? "일반 쓰레기" : "음식물 쓰레기"}
                </span>
              </div>
              {disposeTypes.includes(type) && (
                <div className="w-6 h-6 rounded-full bg-primary-user flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
            {disposeTypes.includes(type) && (
              <Textarea
                placeholder={`${type === "recyclable" ? "재활용 분리수거" : type === "general" ? "일반 쓰레기" : "음식물 쓰레기"} 배출방법을 입력해주세요.`}
                className="min-h-[80px] p-3 text-base bg-gray-50"
                value={disposalMethods[type]}
                onChange={(e) => handleDisposalMethodChange(type, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashDisposalInfo;
