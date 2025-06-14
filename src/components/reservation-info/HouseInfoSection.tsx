
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReservationFormData } from "@/types/reservation";
import { EntryInfo, HousekeepingInfo, CleaningToolsInfo } from "./index";

interface HouseInfoSectionProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  addressData: string | null;
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
}

const HouseInfoSection: React.FC<HouseInfoSectionProps> = ({
  customerInfo,
  onCustomerInfoChange,
  addressData,
  activeDialog,
  setActiveDialog
}) => {
  const navigate = useNavigate();

  const getPetStatusText = () => {
    if (!customerInfo.pet || customerInfo.pet === 'none') return "반려동물 없음";
    return customerInfo.pet === 'dog' ? '강아지 있음' : customerInfo.pet === 'cat' ? '고양이 있음' : '기타 반려동물 있음';
  };

  const getInfantStatusText = () => {
    if (!customerInfo.infant) return "영유아 없음";
    return "영유아 있음";
  };

  const getCctvStatusText = () => {
    if (!customerInfo.security || customerInfo.security === 'none') return "CCTV 없음";
    return "CCTV 있음";
  };

  const getParkingStatusText = () => {
    if (!customerInfo.parking || customerInfo.parking === 'imposible') {
      return "주차 불가능";
    } else if (customerInfo.parking == 'dontknow') {
      return "모르겠습니다"
    } else {
      return "주차 가능";
    }
  };

  const getEntryMethodText = () => {
    switch (customerInfo.entry) {
      case 'home':
        return '집에 있어요, 오시면 초인종 눌러주세요.';
      case 'password':
        return '비밀번호로 출입';
      case 'key':
        return '열쇠 수령';
      default:
        return '출입 방법 미지정';
    }
  };

  const getCleaningToolsText = () => {
    return customerInfo.supply_location || "미입력";
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <h3 className="font-medium">집 정보</h3>
          <p className="text-gray-600 mt-1">
            집 정보 상세보기
          </p>
        </div>
        <button onClick={() => navigate('/reservation/house-info')} className="text-gray-500">
          보기
        </button>
      </div>

      {/* Address Section */}
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <h3 className="font-medium">주소</h3>
          <p className="text-gray-600 mt-1">
            {addressData || customerInfo.address || "경기도 오산시 경기대로 178 (원동), 427호"}
          </p>
        </div>
        <button onClick={() => navigate('/reservation/update-address')} className="text-gray-500">
          변경
        </button>
      </div>

      {/* Entry Method Section */}
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <h3 className="font-medium">출입방법</h3>
          <p className="text-gray-600 mt-1">{getEntryMethodText()}</p>
        </div>
        <Dialog open={activeDialog === 'entry'} onOpenChange={(open) => setActiveDialog(open ? 'entry' : null)}>
          <DialogTrigger asChild>
            <button className="text-gray-500">
              변경
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <DialogTitle>출입 정보 수정</DialogTitle>
            <EntryInfo
              customerInfo={customerInfo}
              onCustomerInfoChange={onCustomerInfoChange}
            />
            <Button
              className="w-full mt-4"
              onClick={() => setActiveDialog(null)}
            >
              완료
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* House Details Section */}
      <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div>
          <h3 className="font-medium">상세정보</h3>
          <p className="text-gray-600 mt-1">
            {getPetStatusText()}, {getInfantStatusText()}, {getCctvStatusText()}, {getParkingStatusText()}
          </p>
        </div>
        <Dialog open={activeDialog === 'houseDetails'} onOpenChange={(open) => setActiveDialog(open ? 'houseDetails' : null)}>
          <DialogTrigger asChild>
            <button className="text-gray-500">
              변경
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md max-h-[80vh] overflow-y-auto">
            <DialogTitle>집 상세정보 수정</DialogTitle>

            <HousekeepingInfo
              customerInfo={customerInfo}
              onCustomerInfoChange={onCustomerInfoChange}
            />

            <Button
              className="w-full mt-4"
              onClick={() => setActiveDialog(null)}
            >
              완료
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cleaning Tools Location Section */}
      <div className="flex justify-between items-center py-3">
        <div>
          <h3 className="font-medium">청소도구 위치</h3>
          <p className="text-gray-600 mt-1">{getCleaningToolsText()}</p>
        </div>
        <Dialog open={activeDialog === 'cleaningTools'} onOpenChange={(open) => setActiveDialog(open ? 'cleaningTools' : null)}>
          <DialogTrigger asChild>
            <button className="text-gray-500">
              변경
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogTitle>청소도구 위치 수정</DialogTitle>
            <CleaningToolsInfo
              customerInfo={customerInfo}
              onCustomerInfoChange={onCustomerInfoChange}
            />

            <Button
              className="w-full mt-4"
              onClick={() => setActiveDialog(null)}
            >
              완료
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HouseInfoSection;
