
import React from 'react';
import { Cctv, ParkingCircle } from "lucide-react";
import { ReservationData } from "@/types/reservation";

interface AdditionalInfoProps {
  reservation: ReservationData | null;
}

const AdditionalInfo = ({ reservation }: AdditionalInfoProps) => {
  return (
    <div className="mt-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">부가정보</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Cctv className="w-10 h-10" strokeWidth={1} />
          <span>CCTV, 없음</span>
        </div>
        <div className="flex items-center gap-2">
          <ParkingCircle className="w-10 h-10" strokeWidth={1} />
          <span>무료주차, {reservation?.parking === 'available' ? '가능' : '불가능'}</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
