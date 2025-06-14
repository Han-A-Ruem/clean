
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { ReservationFormData } from "@/types/reservation";

interface ContactInfoProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
}) => {
  const { userData } = useUser();
  const [useSamePhone, setUseSamePhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(customerInfo.phone_number?.toString() || "");

  // Update local phoneNumber state when customerInfo changes from parent
  useEffect(() => {
    if (!useSamePhone && customerInfo.phone_number) {
      setPhoneNumber(customerInfo.phone_number.toString());
    }
  }, [customerInfo.phone_number, useSamePhone]);

  // Effect to update phone when "same as user" is toggled
  useEffect(() => {
    if (useSamePhone && userData?.phone) {
      setPhoneNumber(userData.phone);
      onCustomerInfoChange({ phone_number: Number(userData.phone) });
    }
  }, [useSamePhone, userData?.phone]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneValue = e.target.value;
    setPhoneNumber(newPhoneValue);
    
    // Only convert to number and update parent if there's a valid value
    if (newPhoneValue && !isNaN(Number(newPhoneValue))) {
      onCustomerInfoChange({ phone_number: Number(newPhoneValue) });
    }
  };

  return (
    <div className={cn("pt-4", className)}>
      <span className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">연락처</h2>
        <div className="flex gap-2">
          <div 
            onClick={() => setUseSamePhone(!useSamePhone)}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center cursor-pointer",
              useSamePhone ? "bg-primary-user" : "border-2 border-gray-300"
            )}
          >
            {useSamePhone && <Check className="text-white w-4 h-4" />}
          </div>
          <span className="text-sm">예약자와 동일</span>
        </div>
      </span>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder="010-0000-0000"
        className="bg-gray-50 py-6 px-4 text-lg"
        disabled={useSamePhone}
      />
      <p className="text-[#8E9196] mt-2 text-sm">※ 예약 확인 및 매니저님과 통화 용도로 쓰입니다.</p>
    </div>
  );
};

export default ContactInfo;
