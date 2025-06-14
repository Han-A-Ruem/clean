
import React from "react";
import { cn } from "@/lib/utils";

interface BottomPriceBarProps {
  price: string;
  onNext: () => void;
  disabled?: boolean;
}

const BottomPriceBar: React.FC<BottomPriceBarProps> = ({ 
  price, 
  onNext,
  disabled = false 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-4 px-4 z-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xl font-semibold">{price}</p>
          <button className="text-sm text-gray-500">자세히</button>
        </div>
        <button
          onClick={onNext}
          disabled={disabled}
          className={cn(
            "bg-primary-user text-white px-8 py-3 rounded-lg transition-all",
            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-user/90"
          )}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default BottomPriceBar;
