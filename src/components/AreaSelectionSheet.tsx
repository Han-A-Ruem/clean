
import React, { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AreaSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (area: number) => void;
  initialValue?: number;
  type?: 'user' | 'cleaner';
}

const AreaSelectionSheet = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialValue = 0,
  type = 'user'
}: AreaSelectionSheetProps) => {
  const [area, setArea] = useState<number | undefined>(initialValue || undefined);

  const handleSave = () => {
    if (area) {
      onSave(area);
      onClose();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="pb-10 h-[50vh] rounded-t-3xl">
        <SheetHeader className="pt-6">
          <SheetTitle className="text-center">평수(공급면적) 입력</SheetTitle>
        </SheetHeader>
        
        <div className="py-8 flex flex-col items-center">
          <div className="mb-4 flex items-center w-full max-w-[200px]">
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              className="text-center text-2xl h-14 border-none focus:ring-0"
              value={area || ''}
              onChange={(e) => setArea(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="0"
              autoFocus
            />
            <span className="ml-2 text-lg">평</span>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            실내 면적이 아닌 공급 면적을 입력해주세요
          </p>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-4">
          <Button 
            onClick={handleSave}
            className={`w-full bg-primary-${type} hover:bg-primary-${type}/90 text-white py-6 text-lg`}
            disabled={!area}
          >
            확인
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AreaSelectionSheet;
