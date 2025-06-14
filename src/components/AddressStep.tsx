
import React from 'react';
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AddressStepProps {
  street: string;
  detail: string;
  onStreetChange: (value: string) => void;
  onDetailChange: (value: string) => void;
  onSubmit: () => void;
}

const AddressStep = ({
  street,
  detail,
  onStreetChange,
  onDetailChange,
  onSubmit
}: AddressStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          주소 입력
        </h3>
        <div className="space-y-4">
          <Input 
            placeholder="주소를 입력해주세요" 
            value={street} 
            onChange={e => onStreetChange(e.target.value)} 
            required 
          />
          <Input 
            placeholder="상세주소를 입력해주세요" 
            value={detail} 
            onChange={e => onDetailChange(e.target.value)} 
            required 
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity w-full md:w-auto"
        >
          다음 단계로
        </button>
      </div>
    </form>
  );
};

export default AddressStep;
