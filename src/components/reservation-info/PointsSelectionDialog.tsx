import React, { useState, useEffect } from "react";
import { Wallet, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Checkbox } from "@/components/ui/checkbox";

interface PointsSelectionDialogProps {
  selectedPoints: number;
  onSelectPoints: (points: number) => void;
  prioritizePoints?: boolean;
  onPrioritizePointsChange?: (prioritize: boolean) => void;
}

const PointsSelectionDialog: React.FC<PointsSelectionDialogProps> = ({
  selectedPoints,
  onSelectPoints,
  prioritizePoints = true,
  onPrioritizePointsChange,
}) => {
  const { userData } = useUser();
  const [open, setOpen] = useState(false);
  const [pointsInput, setPointsInput] = useState<string>(selectedPoints ? selectedPoints.toString() : "");
  const [error, setError] = useState<string | null>(null);
  const [usePriorityPoints, setUsePriorityPoints] = useState<boolean>(prioritizePoints);
  const userPoints = userData?.points || 0;
  
  // Calculate discount based on points (1 point = 1 KRW)
  const calculateDiscount = (points: number): number => {
    return points; // 1:1 conversion
  };
  
  const discountAmount = calculateDiscount(Number(pointsInput) || 0);
  
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    setPointsInput(value);
    
    // Validate points
    if (value && parseInt(value) > userPoints) {
      setError(`You can only use up to ${userPoints} points`);
    } else {
      setError(null);
    }
  };
  
  const handleApplyPoints = () => {
    if (!pointsInput || error) return;
    
    const points = parseInt(pointsInput);
    onSelectPoints(points);
    if (onPrioritizePointsChange) {
      onPrioritizePointsChange(usePriorityPoints);
    }
    setOpen(false);
  };
  
  const handleClearPoints = () => {
    onSelectPoints(0);
    setPointsInput("");
    setOpen(false);
  };

  const handlePriorityChange = (checked: boolean) => {
    onPrioritizePointsChange(checked);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary-user bg-transparent hover:bg-gray-50">
          {selectedPoints > 0 ? "변경" : "사용하기"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            포인트 사용
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">보유 포인트</span>
              <span className="font-bold">{userPoints.toLocaleString()}P</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="points" className="text-sm font-medium">
              사용할 포인트
            </label>
            <Input
              id="points"
              placeholder="0"
              value={pointsInput}
              onChange={handlePointsChange}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            {pointsInput && !error && (
              <div className="p-3 bg-cyan-50 text-cyan-700 rounded-lg mt-2">
                <p className="text-sm">
                  {Number(pointsInput).toLocaleString()}P = {discountAmount.toLocaleString()}원
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="prioritizePoints" 
              checked={prioritizePoints}
              onCheckedChange={handlePriorityChange}
            />
            <label
              htmlFor="prioritizePoints"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              포인트 우선 사용하기
            </label>
          </div>
          
          <div className="flex gap-2 justify-end">
            {selectedPoints > 0 && (
              <Button 
                variant="outline" 
                className="text-gray-500"
                onClick={handleClearPoints}
              >
                사용 취소
              </Button>
            )}
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={handleApplyPoints}
              disabled={!!error || !pointsInput}
            >
              적용하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointsSelectionDialog;
