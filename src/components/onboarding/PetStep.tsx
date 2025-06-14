import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/Utils";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";

/**
 * PetStep component for asking if the cleaner can work in places with pets
 */
const PetStep = () => {
  const navigate = useNavigate();
  const { data, setData } = useCleanerRegistration();
  const [loading, setLoading] = useState(false);
  
  // Handle selection of pet preference
  const handlePetPreferenceSelection = (canWorkWithPets: boolean) => {
    setLoading(true);
    
    // Update registration context with the pet preference
    setData({
      ...data,
      canWorkWithPets,
    });
    
    // Navigate to next step or process the selection
    // For demo purposes, we'll just log and set loading false
    console.log("Can work with pets:", canWorkWithPets);
    
    // You would typically navigate to the next step here
    navigate('/onboarding/confirm-details');
    
    setLoading(false);
  };

  return (
    <div className="space-y-6 min-h-screen bg-gray-50/80 flex flex-col">
      <PageHeader title="" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Question text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
    애완동물을 있는 집 일 가능하세요?
            </h1>
            <p className="text-sm text-muted-foreground">
                강아지, 고양이와 함께 생활하는 가정이 많네요. 무섭하셔서 일할 수 없는 경우 알려주세요.
            </p>
          </div>

          {/* Button options */}
          <div className="space-y-4 pt-4">
            <Button
              variant="outline"
              className="w-full h-14 text-primary-cleaner border border-primary-cleaner hover:bg-primary-cleaner/10 bg-blue-50"
              onClick={() => handlePetPreferenceSelection(true)}
              disabled={loading}
            >
                일 가능해요
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-14 text-primary-cleaner border border-primary-cleaner hover:bg-primary-cleaner/10"
              onClick={() => handlePetPreferenceSelection(false)}
              disabled={loading}
            >
              불 가능해요
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetStep;