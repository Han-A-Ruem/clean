
import { ArrowLeft, ChevronRight } from "lucide-react";

interface EducationRegionSelectProps {
  onBack: () => void;
  onSelectRegion: (region: string) => void;
}

const EducationRegionSelect = ({ onBack, onSelectRegion }: EducationRegionSelectProps) => {
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

  return (
    <div className="min-h-screen bg-background cleaner-theme">
      <div className="container px-4">
        <div className="flex items-center py-4">
          <button 
            onClick={onBack}
            className="flex items-center text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            뒤로가기
          </button>
        </div>

        <div className="py-6 space-y-6">
          <h1 className="text-2xl font-bold">원하는 교육 지역을<br />선택해 주세요.</h1>

          <div className="space-y-4">
            {regions.map((region, index) => (
              <button
                key={index}
                onClick={() => onSelectRegion(region)}
                className="w-full flex items-center justify-between py-4 px-1 border-b border-gray-100"
              >
                <span className="text-lg">{region}</span>
                <ChevronRight className="h-6 w-6 text-primary-cleaner" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationRegionSelect;
