
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

interface CleaningToolsSectionProps {
  title: string;
  items: string[];
  category: string;
  selectedItems: string[];
  onToggle: (category: string, item: string) => void;
}

const CleaningToolsSection: React.FC<CleaningToolsSectionProps> = ({
  title,
  items,
  category,
  selectedItems,
  onToggle
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <CheckCircle2 className="h-5 w-5 text-primary-user" />
        <Label className="text-base font-medium">{title}</Label>
      </div>
      <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md">
        {items.map((item) => (
          <div 
            key={item} 
            onClick={() => onToggle(category, item)}
            className={`
              flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors
              ${selectedItems.includes(item) ? 'bg-primary-user/10 shadow-sm' : 'hover:bg-gray-100'}
            `}
          >
            <Checkbox 
              id={`${category}-${item}`} 
              checked={selectedItems.includes(item)}
              className={selectedItems.includes(item) ? "text-primary-user" : ""}
            />
            <Label 
              htmlFor={`${category}-${item}`}
              className={`cursor-pointer ${selectedItems.includes(item) ? 'font-medium text-primary-user' : ''}`}
            >
              {item}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleaningToolsSection;
