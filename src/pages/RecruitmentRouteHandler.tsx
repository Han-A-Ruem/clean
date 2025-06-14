
import { useParams, Navigate } from "react-router-dom";
import Education from "@/pages/Education";
import HowDidYouHear from "@/pages/HowDidYouHear";
import EducationRegionSelect from "@/components/education/EducationRegionSelect";
import { EducationLocations } from "@/components/education/EducationLocations";
import EducationScheduleStep from "@/components/education/EducationScheduleStep";
import { useState } from "react";

const RecruitmentRouteHandler: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  
  if (!id) {
    return <Navigate to="/recruitment" replace />;
  }
  
  // Handle routes directly in the component
  switch (id) {
    case "signup":
      return <Education />;
    case "how-did-you-hear":
      return <HowDidYouHear />;
    case "schedule":
      return (
        <EducationScheduleStep
          handleBack={() => window.history.back()}
          onContinue={() => {
            window.location.href = "/recruitment/region";
          }}
        />
      );
    case "region":
      return (
        <EducationRegionSelect 
          onBack={() => window.history.back()}
          onSelectRegion={(region) => {
            setSelectedRegion(region);
            window.location.href = "/recruitment/location";
          }}
        />
      );
    case "location":
      return (
        <EducationLocations 
          region={selectedRegion || "선택된 지역"}
          onBack={() => window.history.back()}
        />
      );
    default:
      return <Navigate to="/recruitment" replace />;
  }
};

export default RecruitmentRouteHandler;
