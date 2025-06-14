
import React from 'react';
import { Info } from "lucide-react";
import { ReservationData } from "@/types/reservation";

interface CautionInfoProps {
  reservation?: ReservationData | null;
}

const CautionInfo = ({ reservation }: CautionInfoProps) => {
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-2 justify-between">
        <h3 className="text-lg font-bold">입실 후 주의사항</h3>
        <span className="text-red-500 flex space-x-2">
          <Info />
          <p>필수확인</p>
        </span>
      </div>
      <p className="text-gray-700">
        {reservation?.custom_message || "침대방과 안방 회장실을 꼼꼼히 치워주세요."}
      </p>
    </div>
  );
};

export default CautionInfo;
