
import React from 'react';
import { Button } from "@/components/ui/button";
import { Map, Navigation } from "lucide-react";
import { ReservationData } from "@/types/reservation";

interface AddressInfoProps {
  reservation: ReservationData | null;
}

const AddressInfo = ({ reservation }: AddressInfoProps) => {
  const hasCoordinates = reservation?.address?.longitude && reservation?.address?.latitude;
  
  const openMapWithDirections = () => {
    if (!hasCoordinates) return;
    
    const { longitude, latitude } = reservation?.address || {};
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };
  
  const openLocationInMap = () => {
    if (!hasCoordinates) return;
    
    const { longitude, latitude } = reservation?.address || {};
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">주소</h3>
      <p className="text-gray-700 mb-2">{reservation?.address?.address.split(' ').slice(0, 3).join(' ') || "서울특별시 강남구 대치동 316"}</p>
      <p className="text-gray-700 mb-4">{reservation?.address?.address.split(' ').slice(3).join(' ') || "은마아파트 28동 211호"}</p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 bg-gray-100"
          onClick={openMapWithDirections}
        >
          <Navigation className="w-4 h-4 mr-2" />
          길찾기
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 bg-gray-100"
          onClick={openLocationInMap}
        >
          <Map className="w-4 h-4 mr-2" />
          지도보기
        </Button>
      </div>
    </div>
  );
};

export default AddressInfo;
