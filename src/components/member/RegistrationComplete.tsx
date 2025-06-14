
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CleaningStaffWelcome from "./CleaningStaffWelcome";

const RegistrationComplete = () => {
  const [showCleaningStaff, setCleaningStaff] = useState(false);

  if(showCleaningStaff) {
    return <CleaningStaffWelcome 
      onBack={() => setCleaningStaff(false)}
    />
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 cleaner-theme">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 animate-fade-in">
              <img
                src="/lovable-uploads/3a83e55a-340f-451a-90a4-ba3d17d08ef1.png"
                alt="Registration Complete"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">등록완료!</h1>
            <p className="text-gray-600">남은 교육까지 힘내세요.</p>
          </div>
        </div>

        <Button 
          onClick={() => setCleaningStaff(true)}
          className="w-full bg-primary-cleaner text-white hover:bg-primary-cleaner/90"
        >
          완료
        </Button>
      </div>
    </div>
  );
};

export default RegistrationComplete;
