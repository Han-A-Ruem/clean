
import React from 'react';
import { cn } from "@/lib/utils";
import { Tabs } from './hooks/useDateSelection';

interface TabAndFrequencySelectorProps {
  activeTab: Tabs
  onTabChange: (tab:Tabs) => void;
}

const TabAndFrequencySelector: React.FC<TabAndFrequencySelectorProps> = ({
  activeTab, 
  onTabChange,
}) => {
  const frequencyOptions: { value: Tabs; label: string }[] = [
    { value: 'once_weekly', label: '주 1회' },
    { value: 'multiple_weekly', label: '주 여러 회' },
    { value: 'biweekly', label: '격주 1회' },
    { value: 'multiple_biweekly', label: '격주 여러 회' },
    { value: 'once_monthly', label: '월 1회' },
    { value: 'multiple_monthly', label: '월 여러 회' }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {frequencyOptions.map((tb) => (
        <button
          key={tb.value}
          onClick={() => onTabChange(tb.value)}
          className={cn(
            "py-2 px-2 border rounded-md text-center font-medium text-sm transition-colors",
            activeTab === tb.value
              ? "border-primary-user text-primary-user" 
              : "border-gray-300 text-gray-500"
          )}
        >
          {tb.label}
        </button>
      ))}
    </div>
  );
};

export default TabAndFrequencySelector;
