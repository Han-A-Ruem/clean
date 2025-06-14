
import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from './Utils';

interface RefrigeratorServiceDetailsProps {
  onBack: () => void;
  onNext: (refrigeratorCount: number) => void;
}

const RefrigeratorServiceDetails = ({
  onBack,
  onNext
}: RefrigeratorServiceDetailsProps) => {
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const navigate = useNavigate();

  const handleNext = () => {
    // First call the onNext with the selected count to maintain the state
    onNext(selectedCount);
    // Then navigate to the reservation page
    navigate('/reservation/address');
  };

  return <div className="space-y-6">

    <PageHeader title=''  rightElement={  <span className="text-teal-600 font-medium flex items-center gap-1">
          <span className="w-5 h-5 bg-teal-600 text-white rounded-full text-sm flex items-center justify-center">i</span>
          청소 범위
        </span>}
     
     />

      <div className="space-y-4 px-[16px]">
        <h1 className="text-2xl font-bold">냉장고 대수</h1>
        <p className="text-gray-600">
          미리 분류된 반찬통의 음식물 배출 및 설거지와 냉장실 내부 청소를 제공합니다.
        </p>

        <div className="rounded-lg overflow-hidden">
          <img src="/placeholder.svg" alt="Refrigerator cleaning" className="w-full h-48 object-cover bg-gray-100" />
        </div>

        <div className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setSelectedCount(1)}
              className={`p-6 rounded-lg border ${
                selectedCount === 1 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-lg">1대</span>
                <span className="text-gray-500">3시간 소요</span>
              </div>
            </button>
            <button 
              onClick={() => setSelectedCount(2)}
              className={`p-6 rounded-lg border ${
                selectedCount === 2 
                  ? 'border-primary bg-primary/5' 
                  : 'border-gray-200 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex flex-col space-y-1">
                <span className="font-semibold text-lg">2대</span>
                <span className="text-gray-500">5시간 소요</span>
              </div>
            </button>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-bold mb-4">유의사항</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="text-primary">• 냉동실 청소는 진행하지 않습니다.</li>
            <li>• 버릴 음식은 미리 분류(표시) 해주세요.</li>
            <li>• 서비스 전 분류된 음식물과 냉장실 청소 시 발생한 일반, 재활용, 음식물 쓰레기만 배출 및 정리합니다.</li>
            <li>• 냉동고 마지막 두 서비스 진행에 지장을 주는 주는 경우 서비스가 변경될 수 있습니다.</li>
          </ul>
        </div>
      </div>


      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <button 
          onClick={handleNext} 
          className="w-full bg-[#00C7B1] text-white py-4 rounded-lg font-medium"
        >
          다음
        </button>
      </div>
    </div>;
};

export default RefrigeratorServiceDetails;
