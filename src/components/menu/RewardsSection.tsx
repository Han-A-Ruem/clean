
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RewardsSection = () => {
  const navigate = useNavigate();
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-bold">리워드 캐시</h2>
          <div className="ml-1 w-5 h-5 rounded-full border flex items-center justify-center text-sm">?</div>
        </div>
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/menu/info")}
        >
          <span className="font-bold">1,000캐시</span>
          <ChevronRight className="w-5 h-5 ml-1" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-xs">지원금</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold">업무시간 누적 목표 달성</h3>
            <p className="text-gray-600">상생지원금 지원</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span className="text-xs">혜택</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold">고객님께 키트 전달하면</h3>
            <p className="text-gray-600">1,000캐시+추가보상</p>
          </div>
        </div>
      </div>

      <button 
        className="w-full text-center py-4 text-gray-600" 
        onClick={() => navigate("/menu/info")}
      >
        미션 더보기 <ChevronRight className="inline-block w-4 h-4" />
      </button>
    </div>
  );
};

export default RewardsSection;
