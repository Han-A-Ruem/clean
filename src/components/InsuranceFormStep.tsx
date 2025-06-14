
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BankSelectionStep from "./BankSelectionStep";
import { useUser } from "@/contexts/UserContext";

interface InsuranceFormStepProps {
  onBack: () => void;
}

const InsuranceFormStep = ({ onBack }: InsuranceFormStepProps) => {
  const [showBankSelection, setShowBankSelection] = useState(false);
  const { userData } = useUser();
  
  // Determine theme class based on user type (defaults to cleaner if not specified)
  const themeClass = userData?.type === 'customer' ? 'user-theme' : 'cleaner-theme';

  if (showBankSelection) {
    return <BankSelectionStep onBack={() => setShowBankSelection(false)} />;
  }

  return (
    <div className={`min-h-screen bg-white ${themeClass}`}>
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button className="text-lg">메뉴</button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">보수지급을 위한</h1>
          <h2 className="text-2xl font-bold">정보를 입력해 주세요.</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">한아름님 주민등록번호</p>
          <div className="flex gap-2">
            <Input placeholder="941020" className="flex-1" />
            <div className="relative flex-1">
              <Input placeholder="뒷자리 7숫자" type="password" className="w-full" />
            </div>
          </div>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
          <Button 
            className="w-full bg-theme hover:bg-theme/90" 
            onClick={() => setShowBankSelection(true)}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceFormStep;
