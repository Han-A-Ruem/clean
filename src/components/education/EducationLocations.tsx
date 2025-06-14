
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EducationApplicationSheet from "./EducationApplicationSheet";
import EducationConfirmation from "./EducationConfirmation";

interface EducationLocationsProps {
  region: string;
  onBack: () => void;
}

interface Location {
  name: string;
  station: string;
  time: string;
  address: string;
  date: string;
  parking?: string;
}

export const EducationLocations = ({ region, onBack }: EducationLocationsProps) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const locations: Location[] = [
    {
      name: "성남 교육 센터",
      station: "모란역",
      time: "오전 9:00~오후 2:00",
      address: "경기 화성시 경기대로 1038",
      date: "2025년 01월 07일(화요일)",
      parking: "주차불가 (대중교통 이용)"
    },
    {
      name: "영등포 교육 센터",
      station: "문래역",
      time: "오후 1:00~오후 6:00",
      address: "서울 영등포구 문래로 1234",
      date: "2025년 01월 07일(화요일)",
    },
    {
      name: "화성 교육 센터",
      station: "1호선 병점역",
      time: "오후 1:00~오후 6:00",
      address: "경기 화성시 병점로 5678",
      date: "2025년 01월 07일(화요일)",
    },
    {
      name: "성북 교육 센터",
      station: "보문역",
      time: "오후 1:00~오후 6:00",
      address: "서울 성북구 보문로 9012",
      date: "2025년 01월 07일(화요일)",
    },
  ];

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsSheetOpen(true);
  };


  if (showConfirmation) {
    return (
      <EducationConfirmation
        locationName={selectedLocation.name}
        locationAddress={selectedLocation.address}
        date={selectedLocation.date}
        time={selectedLocation.time}
        directions="1호선 병점역 1번출구로 나오셔서 맞은편 횡단보도를 건넌 후 직숙길을 따라 100m 걸어오면 오른편에 '올리브영(OLIVE YOUNG)'을 끼고 오른쪽 골목으로 꺾어 직진합니다. 병점역 사거리까지 오면 왼쪽 대각선에 보이는 '우리은행'건물 4층 교육장입니다. 주차불가합니다. 대중교통을 이용해주세요."
        handleChangeLocation={onBack}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 cleaner-theme">
      <div className="container px-4">
        <div className="flex items-center py-4 border-b">
          <button 
            onClick={onBack}
            className="flex items-center text-lg"
          >
            <ArrowLeft className="h-6 w-6 mr-2" />
            {region}
          </button>
        </div>

        <div className="py-6">
          <h2 className="text-lg mb-4">1월 7일(화)</h2>

          <div className="space-y-4">
            {locations.map((location, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium mb-1">
                  {location.name} ({location.station})
                </h3>
                <p className="text-gray-600 mb-1">{location.station}</p>
                <p className="text-gray-600 mb-4">{location.time}</p>
                <Button 
                  variant="outline" 
                  className="w-full border-primary-cleaner text-primary-cleaner hover:bg-primary-cleaner/5"
                  onClick={() => handleLocationSelect(location)}
                >
                  교육 신청하기
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedLocation && (
        <EducationApplicationSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          locationName={selectedLocation.name}
          locationAddress={selectedLocation.address}
          date={selectedLocation.date}
          time={selectedLocation.time}
          parking={selectedLocation.parking}
          handleSubmit={() => setShowConfirmation(true)}
        />
      )}
    </div>
  );
};
