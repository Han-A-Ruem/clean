
import React from "react";
import { useNavigate } from "react-router-dom";
import HowDidYouHearComponent from "@/components/recruitment/HowDidYouHear";

const HowDidYouHear: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleComplete = (source: string, customSource?: string) => {
    // After completing this step, navigate to the signup page
    navigate("/recruitment/schedule");
  };

  return (
    <HowDidYouHearComponent
      onComplete={handleComplete}
    />
  );
};

export default HowDidYouHear;
