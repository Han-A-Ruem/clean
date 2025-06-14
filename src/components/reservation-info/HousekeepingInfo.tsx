
import React from "react";
import { cn } from "@/lib/utils";
import { pets, infants, cctv, parking } from '@/data/customerFields';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ReservationFormData } from "@/types/reservation";

interface HousekeepingInfoProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
}

const HousekeepingInfo: React.FC<HousekeepingInfoProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Pets section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">반려동물</h2>
        <p className="text-[#8E9196] mb-4">함께 생활하는 경우 꼭 체크해주세요</p>
        <RadioGroup
          value={customerInfo.pet || "none"}
          onValueChange={(value) => onCustomerInfoChange({ pet: value })}
          className="flex flex-col space-y-3"
        >
          {pets.map((pet) => (
            <div key={pet.value} className="w-full">
              <label className="cursor-pointer w-full block">
                <Card className={cn(
                  "w-full transition-all hover:bg-gray-50",
                  customerInfo.pet === pet.value 
                    ? "border-primary-user bg-primary-user/5" 
                    : "border-gray-200"
                )}>
                  <div className="flex items-center p-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      customerInfo.pet === pet.value ? "bg-primary-user text-white" : "bg-gray-100"
                    )}>
                      {React.cloneElement(pet.icon, {
                        className: cn(
                          "w-6 h-6",
                          customerInfo.pet === pet.value ? "text-white" : "text-gray-600"
                        )
                      })}
                    </div>
                    <span className="flex-grow font-medium">{pet.name}</span>
                    <RadioGroupItem value={pet.value} className="text-primary-user" />
                  </div>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Infants section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">영유아 (7세 이하)</h2>
        <p className="text-[#8E9196] mb-4">함께 생활하는 경우 꼭 체크해주세요</p>
        <RadioGroup
          value={customerInfo.infant ? "yes" : "no"}
          onValueChange={(value) => onCustomerInfoChange({ infant: value === "yes" })}
          className="flex flex-col space-y-3"
        >
          {infants.map((infant) => (
            <div key={infant.value} className="w-full">
              <label className="cursor-pointer w-full block">
                <Card className={cn(
                  "w-full transition-all hover:bg-gray-50",
                  customerInfo.infant === (infant.value === "yes") 
                    ? "border-primary-user bg-primary-user/5" 
                    : "border-gray-200"
                )}>
                  <div className="flex items-center p-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      customerInfo.infant === (infant.value === "yes") ? "bg-primary-user text-white" : "bg-gray-100"
                    )}>
                      {React.cloneElement(infant.icon, {
                        className: cn(
                          "w-6 h-6",
                          customerInfo.infant === (infant.value === "yes") ? "text-white" : "text-gray-600"
                        )
                      })}
                    </div>
                    <span className="flex-grow font-medium">{infant.name}</span>
                    <RadioGroupItem value={infant.value} className="text-primary-user" />
                  </div>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* CCTV section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">보안 카메라 (CCTV)</h2>
        <p className="text-[#8E9196] mb-4">설치되어 있는 경우 체크해주세요</p>
        <RadioGroup
          value={customerInfo.security || "no"}
          onValueChange={(value) => onCustomerInfoChange({ security: value })}
          className="flex flex-col space-y-3"
        >
          {cctv.map((option) => (
            <div key={option.value} className="w-full">
              <label className="cursor-pointer w-full block">
                <Card className={cn(
                  "w-full transition-all hover:bg-gray-50",
                  customerInfo.security === option.value 
                    ? "border-primary-user bg-primary-user/5" 
                    : "border-gray-200"
                )}>
                  <div className="flex items-center p-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      customerInfo.security === option.value ? "bg-primary-user text-white" : "bg-gray-100"
                    )}>
                      {React.cloneElement(option.icon, {
                        className: cn(
                          "w-6 h-6",
                          customerInfo.security === option.value ? "text-white" : "text-gray-600"
                        )
                      })}
                    </div>
                    <span className="flex-grow font-medium">{option.name}</span>
                    <RadioGroupItem value={option.value} className="text-primary-user" />
                  </div>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Parking section */}
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">무료 주차</h2>
        <p className="text-[#8E9196] mb-4">주차 가능 여부를 알려주세요</p>
        <RadioGroup
          value={customerInfo.parking || "imposible"}
          onValueChange={(value) => onCustomerInfoChange({ parking: value })}
          className="flex flex-col space-y-3"
        >
          {parking.map((option) => (
            <div key={option.value} className="w-full">
              <label className="cursor-pointer w-full block">
                <Card className={cn(
                  "w-full transition-all hover:bg-gray-50",
                  customerInfo.parking === option.value 
                    ? "border-primary-user bg-primary-user/5" 
                    : "border-gray-200"
                )}>
                  <div className="flex items-center p-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mr-3",
                      customerInfo.parking === option.value ? "bg-primary-user text-white" : "bg-gray-100"
                    )}>
                      {React.cloneElement(option.icon, {
                        className: cn(
                          "w-6 h-6",
                          customerInfo.parking === option.value ? "text-white" : "text-gray-600"
                        )
                      })}
                    </div>
                    <span className="flex-grow font-medium">{option.name}</span>
                    <RadioGroupItem value={option.value} className="text-primary-user" />
                  </div>
                </Card>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};

export default HousekeepingInfo;
