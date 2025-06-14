
import React from 'react';
import { ReservationData } from "@/types/reservation";

interface CleaningSuppliesProps {
  reservation: ReservationData | null;
}

const CleaningSupplies = ({ reservation }: CleaningSuppliesProps) => {
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">청소용품 위치</h3>
      <p className="text-gray-700">
        {reservation?.supply_location || "현관신발장옆 수납장에 있고 걸레는 냉장고옆 서랍하단에 있어요. 청소기는 깨내두겠습니다."}
      </p>
    </div>
  );
};

export default CleaningSupplies;
