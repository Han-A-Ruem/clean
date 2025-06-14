
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PageHeader } from "../Utils";

interface CleaningArea {
  id: string;
  name: string;
  color: string;
  details: string[];
}
interface CleanArrowDetailsProps {
  showAppBar?: boolean;
}

const cleaningAreas: CleaningArea[] = [
  {
    id: "kitchen",
    name: "주방",
    color: "#F97316", // 주황색
    details: [
      "식탁 위 정리",
      "설거지",
      "가스레인지 및 인덕션 기름때 제거",
      "싱크대 및 거름망 세척"
    ]
  },
  {
    id: "bathroom",
    name: "화장실",
    color: "#F43F5E", // 빨강/분홍
    details: [
      "거울 물때 제거",
      "전면 선반 청소 및 정리",
      "수전, 세면대, 변기 내부/외부 청소",
      "배수구 머리카락 제거 및 청소",
      "바닥 물기 제거"
    ]
  },
  {
    id: "rooms",
    name: "방",
    color: "#8B5CF6", // 보라색
    details: [
      "책상 및 옷장 등 가구 먼지 제거",
      "건조된 빨래 개기",
      "침구 정리",
      "물건 제자리 정리"
    ]
  },
  {
    id: "living-room",
    name: "거실",
    color: "#0EA5E9", // 파란색
    details: [
      "소파 및 테이블 등 가구 먼지 제거",
      "바닥 청소 (청소기 및 물걸레)",
      "물건 정리정돈"
    ]
  },
  {
    id: "doorway",
    name: "현관",
    color: "#10B981", // 초록색
    details: [
      "바닥 먼지 청소",
      "신발 정리 및 정돈"
    ]
  },
  {
    id: "final-cleanup",
    name: "마무리 청소",
    color: "#0D9488", // 청록색
    details: [
      "일반, 음식물, 재활용 쓰레기 배출 (선택 시)",
      "청소 완료 후 최종 점검"
    ]
  }
];
const CleanArrowDetails: React.FC<CleanArrowDetailsProps> = ({showAppBar = true}) => {
  const [selectedArea, setSelectedArea] = useState<CleaningArea | null>(null);

  const handleArrowClick = (area: CleaningArea) => {
    setSelectedArea(prev => prev?.id === area.id ? null : area);
  };

  return (
    <div className="w-full">
      {showAppBar &&
      <PageHeader title="청소 진행 과정"/>}
      
      {/* Arrow Process Flow */}
      <div className="flex flex-row overflow-x-auto px-4 pb-4">
        {cleaningAreas.map((area, index) => (
          <div 
            key={area.id}
            className={cn(
              "relative min-w-[120px] h-[80px] flex items-center justify-center cursor-pointer",
              "transition-all duration-200",
              selectedArea?.id === area.id ? "scale-105" : ""
            )}
            onClick={() => handleArrowClick(area)}
          >
            {/* Arrow Shape */}
            <div 
              className="absolute inset-0 clip-path-arrow flex items-center justify-center" 
              style={{ 
                backgroundColor: area.color,
                clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)",
                zIndex: index + 1
              }}
            >
              <span className={`text-white font-bold text-center ${index===5 ? 'pl-5 line-clamp-1': ''}`}>{area.name}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Details Card */}
      {selectedArea && (
        <Card className="mx-4"  >
          <CardContent className="pt-6 ">
            <h4 className="font-medium text-lg mb-2">{selectedArea.name} 청소 내용</h4>
            <ul className="list-disc pl-5 space-y-1">
              {selectedArea.details.map((detail, index) => (
                <li key={index} className="text-gray-700">{detail}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CleanArrowDetails;
