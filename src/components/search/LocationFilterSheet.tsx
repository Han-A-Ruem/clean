import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from '@/contexts/SearchContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const REGIONS = [
  "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", 
  "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", 
  "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", 
  "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];

const WORK_TYPES = [
  { value: 'highest-pay', label: '시급이 높은 일자리' },
  { value: 'closest', label: '집에서 가까운 일자리' },
  { value: 'irrelevant', label: '상관 없어요' }
];

const WORK_TIMES = [
  { value: 'morning', label: '오전 일자리' },
  { value: 'afternoon', label: '오후 일자리' },
  { value: 'evening', label: '저녁 일자리' },
];

interface LocationFilterSheetProps {
  onBack: () => void;
}

const LocationFilterSheet: React.FC<LocationFilterSheetProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { 
    selectedFilter, 
    setSelectedFilter,
    selectedRegions,
    setSelectedRegions,
    selectedWorkTime,
    setSelectedWorkTime,
    resetFilters
  } = useSearchContext();
  const [showRegionDialog, setShowRegionDialog] = useState(false);

  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  
  const handleFilterSelection = (value: string) => {
    setSelectedFilter(value);
  };

  const handleShowRecommendedWork = () => {
    navigate('/search/recommended-work');
  };

  const openRegionDialog = () => {
    setShowRegionDialog(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBack} className="p-2">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold ml-4">일자리 검색</h1>
      </div>

      <div className="divide-y">
        {/* Selected Regions Section */}
        <div className="p-4">
          <div className="flex justify-between items-center py-2" onClick={openRegionDialog}>
            <span className="text-gray-700 font-medium">보고싶은 지역</span>
            <div className="flex items-center text-gray-500">
              <span>{selectedRegions.length}개 지역</span>
              <ChevronRight className="h-5 w-5 ml-1" />
            </div>
          </div>
        </div>

        {/* Work Type Section */}
        <div className="p-4">
          <h2 className="text-gray-700 font-medium mb-4">일자리 유형</h2>
          <div className="space-y-4">
            {WORK_TYPES.map(type => (
              <label 
                key={type.value} 
                className="flex items-center justify-between p-2"
              >
                <span className={selectedFilter === type.value ? "text-blue-600" : "text-gray-700"}>
                  {type.label}
                </span>
                <div 
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedFilter === type.value 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  } flex items-center justify-center`}
                  onClick={() => handleFilterSelection(type.value)}
                >
                  {selectedFilter === type.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Work Time Section */}
        <div className="p-4">
          <h2 className="text-gray-700 font-medium mb-4">일자리 시간</h2>
          <div className="space-y-4">
            {WORK_TIMES.map(time => (
              <label 
                key={time.value} 
                className="flex items-center justify-between p-2"
              >
                <span className={selectedWorkTime === time.value ? "text-blue-600" : "text-gray-700"}>
                  {time.label}
                </span>
                <div 
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedWorkTime === time.value 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-gray-300'
                  } flex items-center justify-center`}
                  onClick={() => setSelectedWorkTime(time.value)}
                >
                  {selectedWorkTime === time.value && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="left-0 right-0 z-[100]  px-4">
        <Button 
          className="w-full bg-primary-cleaner hover:bg-primary-cleaner/80 text-white py-6"
          onClick={handleShowRecommendedWork}
        >
          추천 업무 보기
        </Button>
      </div>

      {/* Region Selection Dialog */}
      <Dialog open={showRegionDialog} onOpenChange={setShowRegionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>지역 선택</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 mt-4 max-h-[60vh] overflow-y-auto">
            {REGIONS.map(region => (
              <div 
                key={region}
                onClick={() => toggleRegion(region)}
                className={`p-2 border rounded-lg text-center text-sm cursor-pointer ${
                  selectedRegions.includes(region) 
                    ? 'bg-primary-cleaner text-white border-primary-cleaner' 
                    : 'text-gray-700 border-gray-300 hover:border-primary-cleaner/30'
                }`}
              >
                {region}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowRegionDialog(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationFilterSheet;
