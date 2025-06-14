
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CleaningStaffPromises from "./CleaningStaffPromises";

interface CleaningStaffWelcomeProps {
  onBack: () => void;
}

const CleaningStaffWelcome = ({ onBack }: CleaningStaffWelcomeProps) => {
  const [showPromises, setShowPromises] = useState(false);

  return (
    <div className="min-h-screen bg-white cleaner-theme">
      {showPromises ? (
        <CleaningStaffPromises onClose={() => setShowPromises(false)} />
      ) : (
        <>
          <div className="sticky top-0 bg-white z-10">
            <div className="flex items-center p-4">
              <button onClick={onBack} className="p-2">
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="ml-2 text-lg font-medium">
                청소연구소 매니저라면 꼭 약속해주세요!
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center px-4 pt-8 pb-16">
            <div className="w-64 h-64 mb-8">
              <img
                src="placeholder.svg"
                alt="Cleaning Staff Welcome"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-center space-y-4 mb-12">
              <h2 className="text-2xl font-bold">
                청소연구소 매니저라면<br />
                꼭 약속해주세요!
              </h2>
              <p className="text-gray-600">
                약속에 동의해주셔야 입무가 가능합니다.
              </p>
            </div>

            <Button
              onClick={() => setShowPromises(true)}
              className="w-full max-w-md bg-primary-cleaner text-white hover:bg-primary-cleaner/90"
            >
              약속하러 가기
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CleaningStaffWelcome;
