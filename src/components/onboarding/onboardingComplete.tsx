import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/Utils";
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

/**
 * OnboardingComplete component
 * Splash screen that appears at the end of the onboarding process,
 * encouraging users to sign up for an interview with option to skip
 */
const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();
  const { data, setData } = useCleanerRegistration();
  const [isLoading, setIsLoading] = useState(false);

  // Image path for the illustration
  
  // Function to handle proceeding to interview scheduling
  const handleScheduleInterview = () => {
    setIsLoading(true);
    
    // Update registration context to indicate user wants an interview
    setData({
      ...data,
      wantsInterview: true,
    });
    
    // Navigate to the interview scheduling page
    navigate("/onboarding/schedule");
    
    setIsLoading(false);
  };
  
  // Function to handle skipping the interview
  const handleSkipInterview = () => {
    setIsLoading(true);
    
    // Update registration context to indicate user is skipping interview
    setData({
      ...data,
      wantsInterview: false,
    });
    
    // Navigate to home or dashboard page
    navigate("/");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/80">
      <PageHeader title="" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      
      <div className="flex-1 flex flex-col items-center justify-between p-6">
        {/* Main content area with illustration and text */}
        <div className="flex flex-col items-center justify-center flex-1 text-center max-w-md mx-auto">
          {/* Illustration */}
          <div className="mb-6 ">
      
      {/* icon check from lucid */}
      <div className="bg-green-100 rounded-full p-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          </div>
          
          {/* Text content */}
          <h1 className="text-2xl font-bold mb-2">
            처음이라도 걱정마세요
          </h1>
          <p className="text-lg font-medium mb-4">
            미소가 알려드려요
          </p>
          <p className="text-sm text-gray-600 mb-8">
            미소 상담원과 함께 위쳐 연락드릴게요.
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="w-full space-y-4 mt-auto">
          <Button
            className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90 h-12"
            onClick={handleScheduleInterview}
            disabled={isLoading}
          >
            확인했어요
          </Button>
          
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 h-12"
            onClick={handleSkipInterview}
            disabled={isLoading}
          >
            나중에 할게요
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;