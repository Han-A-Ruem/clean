import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRightToLine, Award, CalendarCheck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EducationLocations } from "@/components/education/EducationLocations";
import EducationRegionSelect from "@/components/education/EducationRegionSelect";

type EducationStep = "schedule" | "region" | "location";

const EducationSchedule = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<EducationStep>("schedule");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const handleBack = () => {
    if (currentStep === "location") {
      setCurrentStep("region");
    } else if (currentStep === "region") {
      setCurrentStep("schedule");
    } else {
      navigate(-1);
    }
  };

  if (currentStep === "region") {
    return (
      <EducationRegionSelect 
        onBack={handleBack}
        onSelectRegion={(region) => {
          setSelectedRegion(region);
          setCurrentStep("location");
        }}
      />
    );
  }

  if (currentStep === "location") {
    return (
      <EducationLocations 
        region={selectedRegion}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4">
        <div className="flex justify-between items-center py-4">
          <button 
            onClick={handleBack}
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            뒤로가기
          </button>
          <Menu className="h-6 w-6" />
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">교육을 예약하세요!</h1>
            <p className="text-muted-foreground">수료 후 업무가 가능합니다.</p>
          </div>

          <div className="flex justify-between items-center px-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative">
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                <CalendarCheck className="w-8 h-8"  strokeWidth={2}/>
              </div>
              <span className="text-sm">교육 예약</span>
            </div>
            <div className="flex-1 h-[1px] bg-gray-200 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative">
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
               <Award className="w-8 h-8" strokeWidth={2}/>
              </div>
              <span className="text-sm">교육 수료</span>
            </div>
            <div className="flex-1 h-[1px] bg-gray-200 mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2 relative">
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  <ArrowRightToLine  className="w-8 h-8" strokeWidth={2} />
              </div>
              <span className="text-sm">활동 시작</span>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">교육현장 및 소개</h2>
            <div className="aspect-video bg-gray-100 rounded-lg relative overflow-hidden">
              <img 
                src="placeholder.svg"
                alt="교육 소개 영상"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-4">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">교육 일정</h2>
            <div className="bg-white rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">가사관리 전문교육 1일 소요</h3>
                  <p className="text-sm text-primary">총 5시간</p>
                </div>
                <span className="text-sm px-2 py-1 bg-gray-100 rounded">채팅</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">1교시</span>
                    <span className="text-gray-600">친절한 서비스인 과정</span>
                    <span>50분</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span></span>
                    <span>휴식 및 출석체크</span>
                    <span>20분</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">2교시</span>
                    <span className="text-gray-600">청소 전문가 과정 I</span>
                    <span>50분</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span></span>
                    <span>휴식 및 출석체크</span>
                    <span>20분</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span></span>
                    <span className="text-gray-600">청소 전문가 과정 II</span>
                    <span>60분</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span></span>
                    <span>휴식 및 출석체크</span>
                    <span>20분</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">3교시</span>
                  <span className="text-gray-600">직업인 과정 & 앱 실습</span>
                  <span>80분</span>
                </div>
                <p className="text-sm text-gray-600">(프로필 사진 촬영)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">교육 장소</h2>
            <div className="bg-white rounded-lg p-4 space-y-4">
              <p className="text-sm text-gray-600">
                청소연구소 교육은 여성인력개발센터·여성발전센터·50+플러��센터와 함께하며, 그 외 전문 교육장에서 진행됩니다.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <img src="placeholder.svg" alt="교육장 이미지 1" className="w-full h-32 object-cover rounded-lg" />
                <img src="placeholder.svg" alt="교육장 이미지 2" className="w-full h-32 object-cover rounded-lg" />
                <img src="placeholder.svg" alt="교육장 이미지 3" className="w-full h-32 object-cover rounded-lg" />
                <img src="placeholder.svg" alt="교육장 이미지 4" className="w-full h-32 object-cover rounded-lg" />
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-primary-cleaner text-white py-6"
            onClick={() => setCurrentStep("region")}
          >
            교육 예약하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EducationSchedule;
