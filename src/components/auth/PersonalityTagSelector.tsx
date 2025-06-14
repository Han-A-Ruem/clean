
import React from 'react';
import { Label } from "@/components/ui/label";
import { Tag } from "lucide-react";

interface PersonalityTagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

const PersonalityTagSelector: React.FC<PersonalityTagSelectorProps> = ({
  tags,
  selectedTags,
  onToggle,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tag className="h-5 w-5 text-primary-user" />
          <Label className="text-base font-medium">성격 </Label>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-md">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => {
                onToggle(tag);
            }}
            className={`
              px-3 py-1 rounded-full text-sm transition-all transform
              ${selectedTags.includes(tag)
                ? 'bg-primary-user text-white shadow-md scale-105'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonalityTagSelector;
