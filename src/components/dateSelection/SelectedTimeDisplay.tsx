
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HopOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReservationFormData } from '@/types/reservation';
import { useReservation } from '@/contexts/ReservationContext';

interface SelectedTimeDisplayProps {
  visitTime: string | null;
  onSelectClenerType: (data: Partial<ReservationFormData>) => void;
  pulse?: string | null;
}

const SelectedTimeDisplay: React.FC<SelectedTimeDisplayProps> = ({
  visitTime, onSelectClenerType,pulse
}) => {
  const [selectedOption, setSelectedOption] = useState<'regular' | 'luxury'>();
  
  // useEffect(() => {
  //   if (selectedOption) {
  //     onSelectClenerType({ 
  //       selectedOption, 
  //       cleaner_type: selectedOption 
  //     });
  //   }
  // }, [selectedOption, onSelectClenerType]);
  

const handleSelectedOption = (option: 'regular' | 'luxury') => {
  setSelectedOption(option);
  onSelectClenerType({ 
          cleaner_type: option 
        });
}
  if (!visitTime) return null;
  
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "py-4 px-4 bg-white rounded-lg mb-4 border cursor-pointer",
            selectedOption === 'regular' ? "border-primary-user" : "border-gray-200",
            pulse
          )}  onClick={() => handleSelectedOption('regular')} >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <HopOff className="w-12 h-12 text-gray-600 p-1 bg-gray-100 rounded-full" />
              </div>
              <div>
                <h1 className='font-bold'>일반 (매화,개나리)</h1>
                <p className="text-sm text-gray-700">
                  당신의집사에서 아직 활동은 적지만<br />
                  청소, 도우미 경력이 있는 분들이 많아요.
                </p>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className=" w-80 space-y-8 bg-transparent bg-white p-4 ">
        <div className="p-0 w-80 bg-white">
            <h2 className="font-bold text-xl mb-2">매화</h2>
            <p className="text-sm">
              가사청소 경력은 1년 미만이지만,<br/>
              30년 이상 베테랑 주부님들이 많아요.
            </p>
          </div>

          <div className="p-0 w-80 bg-white">
            <h2 className="font-bold text-xl mb-2">개나리</h2>
            <p className="text-sm">
              가사청소 경력은 1년 미만이지만,<br/>
              30년 이상 베테랑 주부님들이 많아요.
            </p>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <div className={cn(
            "py-4 px-4 bg-white rounded-lg mb-4 border cursor-pointer",
            selectedOption === 'luxury' ? "border-primary-user" : "border-gray-200"
            ,pulse
          )} onClick={() => handleSelectedOption('luxury')}>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">
                <Sparkles className="w-12 h-12 text-gray-600 p-1 bg-gray-100 rounded-full" />
              </div>
              <div>
                <h1 className='font-bold'>고급 (장미, 해바리기)</h1>
                <p className="text-sm text-gray-700">
                  당신의집사에서 높은 평가와 <br/>
                  경력이 풍부한 전문가가 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className=" w-80 space-y-8 bg-transparent bg-white p-4 ">
        <div className="p-0 w-80 bg-white">
            <h2 className="font-bold text-xl mb-2">장미</h2>
            <p className="text-sm">
            4~7년 경력의 전문가로, <br/> 다양한 가사청소 경험을 갖춘 매니저님들이에요
            </p>
          </div>
          <div className="p-0 w-80 bg-white">
            <h2 className="font-bold text-xl mb-2">해바리기</h2>
            <p className="text-sm">
            7년 이상 경력의 베테랑 매니저님으로, <br/> 믿고 맡길 수 있어요.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectedTimeDisplay;
