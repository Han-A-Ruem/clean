
import React from 'react';
import { format } from 'date-fns';

interface SelectedDateDisplayProps {
  selectedDateList: Date[];
}

const SelectedDateDisplay: React.FC<SelectedDateDisplayProps> = ({
  selectedDateList
}) => {
  if (selectedDateList.length === 0) return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <h3 className="text-md font-medium mb-2">선택된 날짜</h3>
      <div className="flex flex-wrap gap-2">
        {selectedDateList.map((date, index) => (
          <div 
            key={index} 
            className="bg-gray-100 px-3 py-1 rounded-full text-sm"
          >
            {format(date, 'M월 d일')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDateDisplay;
