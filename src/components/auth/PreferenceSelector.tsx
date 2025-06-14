
import React from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserCheck } from "lucide-react";

interface PreferenceSelectorProps {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({
  title,
  options,
  value,
  onChange,
  icon = <UserCheck className="h-5 w-5 text-primary-user" />
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <Label className="text-base font-medium">{title}</Label>
      </div>
      
      <RadioGroup 
        value={value} 
        onValueChange={onChange} 
        className="bg-gray-50 p-3 rounded-md space-y-2"
      >
        {options.map(option => (
          <div 
            key={option.value} 
            className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors
              ${value === option.value ? 'bg-primary-user/10 shadow-sm' : 'hover:bg-gray-100'}`}
            onClick={() => onChange(option.value)}
          >
            <RadioGroupItem 
              value={option.value} 
              id={`${title}-${option.value}`} 
              className={value === option.value ? "text-primary-user" : ""}
            />
            <Label 
              htmlFor={`${title}-${option.value}`}
              className={`cursor-pointer ${value === option.value ? 'font-medium text-primary-user' : ''}`}
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PreferenceSelector;
