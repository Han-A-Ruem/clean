
import React, { useState } from 'react';
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from './Utils';

interface ToiletServiceDetailsProps {
  onBack: () => void;
  onNext: (toiletCount: number) => void;
}

const ToiletServiceDetails = ({
  onBack,
  onNext
}: ToiletServiceDetailsProps) => {
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const navigate = useNavigate();

  const handleNext = () => {
    // First call the onNext with the selected count
    // onNext(selectedCount);
    // Then navigate to the reservation page
    // navigate('/reservation/address');
  };

  return (
    <div className="space-y-6">
      <PageHeader title=''  rightElement={
              <span className="text-teal-600 font-medium flex items-center gap-1 ">
              <span className="w-5 h-5 bg-teal-600 text-white rounded-full text-sm flex items-center justify-center">i</span>
              청소 범위
            </span>
      }/>
      {/* <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
  
      </div> */}

      <div className="space-y-4 px-[16px]">
        <h1 className="text-2xl font-bold">화장실 청소</h1>
        <p className="text-gray-600">
          선반, 수전, 세면대와 변기의 내/외부를 청소하고 바닥 물기를 제거해 마무리합니다.
        </p>

        <div className="rounded-lg overflow-hidden">
          <img src="/placeholder.svg" alt="Toilet cleaning" className="w-full h-48 object-cover bg-gray-100" />
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-bold mb-4">화장실 개수</h2>
          <div className="overflow-x-auto pb-4">
            <div className="inline-flex gap-4">
              {[1, 2, 3, 4, 5].map((count) => (
                <button
                  key={count}
                  onClick={() => setSelectedCount(count)}
                  className={`p-6 rounded-lg border min-w-[120px] ${
                    selectedCount === count
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="font-semibold text-lg">{count}개</span>
                    <span className="text-sm text-gray-500">{count + 1}시간 소요</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-bold mb-4">유의사항</h2>
          <ul className="space-y-4 text-gray-600">
            <li>• 네추럴, 변기 막힘 등 서비스 진행에 지장을 주는 문제가 있는 경우 서비스가 제한될 수 있습니다.</li>
            <li>• 특수 약품 및 도구가 필요한 청소, 천장 및 환풍기 청소는 제공하지 않습니다.</li>
            <li>• 오래된 검정 곰팡이, 타일 줄눈 변색, 석회질, 바닥 테코환상 등 특수청소로 분류되는 오염은 제거가 어려울 수 있습니다.</li>
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
    </div>
  );
};

export default ToiletServiceDetails;
