
import { useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InsuranceFormStep from "../InsuranceFormStep";
import { useRegistration } from "@/contexts/RegistrationContext";

interface AddressFormStepProps {
  onBack: () => void;
  mainAddress: string;
  detailAddress: string;
}

const AddressFormStep = ({
  onBack,
  mainAddress,
  detailAddress
}: AddressFormStepProps) => {
  const [showInsurance, setShowInsurance] = useState(false);
  const [detailInput, setDetailInput] = useState("");
  const { updateAddress } = useRegistration();

  const handleNext = () => {
    // Save the address data to the context
    updateAddress({
      main: mainAddress,
      detail: detailInput || detailAddress,
    });
    
    // Navigate to the next step
    setShowInsurance(true);
  };

  if (showInsurance) {
    return <InsuranceFormStep onBack={() => setShowInsurance(false)} />;
  }

  return <div className="min-h-screen bg-white cleaner-theme">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-6 w-6" />
            <span className="text-lg">상세주소</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          <p className="font-medium text-lg">{mainAddress}</p>
          <p className="text-gray-500">{detailAddress}</p>
        </div>

        <div className="relative">
          <Input 
            placeholder="상세 주소 입력" 
            className="pr-8" 
            value={detailInput} 
            onChange={e => setDetailInput(e.target.value)} 
          />
          {detailInput && <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setDetailInput("")}>
              <X className="h-4 w-4 text-gray-400" />
            </button>}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
          <Button 
            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90" 
            size="lg" 
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      </div>
    </div>;
};

export default AddressFormStep;
