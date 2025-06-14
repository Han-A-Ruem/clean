import { useState } from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../Utils";
import { Button } from "@/components/ui/button"; // Import Button component
import { useCleanerRegistration } from "@/contexts/CleanerRegistrationContext";
import { useNavigate } from "react-router-dom";

const WorkingAreaStep = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data, setData } = useCleanerRegistration();
  const navigate = useNavigate();
  const regions = [
    "서울, 경기, 인천 교육장",
    "광주 교육장",
    "대구, 포항, 경주 교육장",
    "대전, 세종, 청주 교육장",
    "부산, 울산, 창원 교육장",
    "천안 교육장",
    "전주, 완주 교육장",
    "여수, 순천, 광양 교육장",
  ];

  const onSelectRegion = (region: string) => {
    setSelectedRegion(region);
  };

  const handleSubmit = () => {
    if (selectedRegion) {
      console.log("Selected Region:", selectedRegion);

      
      setData({
        ...data,
        workingArea: selectedRegion,
      })
      navigate("/onboarding/pet");
      // Add navigation or further logic here
    }
  };

  return (
    <div className="min-h-screen bg-background cleaner-theme flex flex-col">
      <PageHeader title="뒤로가기" />

      <div className="flex-grow py-6 space-y-6 px-4">
        <h1 className="text-2xl font-bold">원하는 교육 지역을<br />선택해 주세요.</h1>

        <div className="space-y-4">
          {regions.map((region, index) => (
            <button
              key={index}
              onClick={() => onSelectRegion(region)}
              className={`w-full flex items-center justify-between py-4 px-3 border rounded-lg transition-colors ${
                selectedRegion === region
                  ? "border-primary-cleaner bg-primary-cleaner/5"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg text-left">{region}</span>

                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-cleaner">
                    {selectedRegion === region ? (
                      null
                  ) : (
      <div className="text-white bg-white h-5 w-5 rounded-full"></div>
  )}
                </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sticky bottom-0 bg-background border-t border-gray-100">
        <Button
          className="w-full bg-primary-cleaner hover:bg-primary-cleaner/90"
          onClick={handleSubmit}
          disabled={!selectedRegion} // Disable button if no region is selected
        >
          선택 완료
        </Button>
      </div>
    </div>
  );
};

export default WorkingAreaStep;
