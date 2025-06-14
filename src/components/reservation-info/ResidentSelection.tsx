import React, { useState, useEffect } from 'react';
import { useReservation } from "@/contexts/ReservationContext";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ReservationFormData } from '@/types/reservation';
import { PageHeader } from '../Utils';

interface ResidentSelectionProps {
  onNext?: () => void;
  reservationData: ReservationFormData;
  setReservationData: (data: Partial<ReservationFormData>) => void;
}

const ResidentSelection: React.FC<ResidentSelectionProps> = ({ onNext, reservationData, setReservationData }) => {
  const { userData } = useUser();
  const [isResident, setIsResident] = useState<boolean>(false);
  const [residentName, setResidentName] = useState<string>("");
  const [residentPhone, setResidentPhone] = useState<string>("");
  const [sameAsUser, setSameAsUser] = useState<boolean>(false);

  useEffect(() => {
    // Initialize state from reservationData
    if (reservationData) {
      setIsResident(Boolean(reservationData.is_resident));
      setResidentName(reservationData.resident_name || "");
      setResidentPhone(reservationData.resident_phone ? String(reservationData.resident_phone) : "");
    }
  }, [reservationData]);

  useEffect(() => {
    // When user data is available and checkbox is checked, populate the fields
    if (userData && isResident && sameAsUser) {
      // Make sure userData has the expected properties before using them
      const name = userData.name || "";
      const phone = userData.phone || "";
      
      setResidentName(name);
      setResidentPhone(phone);
      
      // Update reservation data
      setReservationData({
        ...reservationData,
        is_resident: isResident,
        resident_name: name,
        resident_phone: phone ? Number(phone.replace(/-/g, "")) : null
      });
    } else if (isResident && !sameAsUser) {
      // If checkbox is unchecked but isResident is true, empty the fields
      if (sameAsUser === false) {
        setResidentName("");
        setResidentPhone("");
        
        setReservationData({
          ...reservationData,
          is_resident: isResident,
          resident_name: "",
          resident_phone: null
        });
      }
    }
  }, [userData, isResident, sameAsUser]);

  const handleIsResidentChange = (checked: boolean) => {
    setIsResident(checked);
    
    if (!checked) {
      // User is not a resident, reset all values
      setSameAsUser(false);
      setResidentName("");
      setResidentPhone("");
      
      setReservationData({
        ...reservationData,
        is_resident: false,
        resident_name: null,
        resident_phone: null
      });
    } else if (checked && !sameAsUser) {
      // User is a resident but not same as current user, keep fields empty
      setResidentName("");
      setResidentPhone("");
      
      setReservationData({
        ...reservationData,
        is_resident: true,
        resident_name: "",
        resident_phone: null
      });
    }
  };

  const handleSameAsUserChange = (checked: boolean) => {
    setSameAsUser(checked);
    
    if (checked && userData && isResident) {
      // Fill in user data
      const name = userData.name || "";
      const phone = userData.phone || "";
      
      setResidentName(name);
      setResidentPhone(phone);
      
      setReservationData({
        ...reservationData,
        resident_name: name,
        resident_phone: phone ? Number(phone.replace(/-/g, "")) : null
      });
    } else if (!checked && isResident) {
      // Clear the fields
      setResidentName("");
      setResidentPhone("");
      
      setReservationData({
        ...reservationData,
        resident_name: "",
        resident_phone: null
      });
    }
  };

  const handleResidentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setResidentName(name);
    setReservationData({
      ...reservationData,
      resident_name: name
    });
  };

  const handleResidentPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setResidentPhone(phone);
    setReservationData({
      ...reservationData,
      resident_phone: phone ? Number(phone.replace(/-/g, "")) : null
    });
  };

  const handleNext = () => {
    if (onNext) onNext();
  };

  return (
    <div className="space-y-6">
      <PageHeader title=''/>
      <div className='px-4 space-y-4'>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">거주자 여부</h2>
          <p className="text-sm text-gray-500">청소할 집에 거주자인지 선택해주세요.</p>
        </div>
        <Switch 
          checked={isResident} 
          onCheckedChange={handleIsResidentChange} 
          id="is-resident"
          className='data-[state=checked]:bg-primary-user'
        />
      </div>

      {isResident && (
        <div className="space-y-4">
          
          
          <div className="space-y-2">

            <div className='flex flex-row justify-between items-center pt-4 pb-1'>
            <Label htmlFor="resident-name">거주자 이름</Label>
            <div className="flex items-center space-x-1">
            <Checkbox 
              id="same-as-user" 
              className='border-primary-user data-[state=checked]:bg-primary-user'
              checked={sameAsUser} 
              onCheckedChange={handleSameAsUserChange} 
            />
            <label
              htmlFor="same-as-user"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              예약자와 동일
            </label>
          </div>
            </div>
            <Input
              id="resident-name"
              placeholder="이름을 입력하세요"
              className=''
              value={residentName}
              onChange={handleResidentNameChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resident-phone">거주자 전화번호</Label>
            <Input
              id="resident-phone"
              placeholder="전화번호를 입력하세요"
              value={residentPhone}
              onChange={handleResidentPhoneChange}
              required
            />
          </div>
        </div>
      )}

      <button
        className="w-full py-3 bg-primary-user text-white rounded-md"
        onClick={handleNext}
      >
        다음
      </button>
      </div>
    </div>
  );
};

export default ResidentSelection;
