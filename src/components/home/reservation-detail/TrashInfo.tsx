
import React from 'react';
import { Recycle, Trash, Apple } from "lucide-react";
import { ReservationData } from "@/types/reservation";

interface TrashInfoProps {
  reservation: ReservationData | null;
}

const TrashInfo = ({ reservation }: TrashInfoProps) => {
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">쓰레기 배출</h3>
      <div className="space-y-2 pt-4">
        {reservation?.dispose_types?.includes('recyclable') && (
          <div className="flex items-center gap-2">
            <Recycle className="w-10 h-10" strokeWidth={1} />
            <span>재활용 쓰레기, 배출 안함</span>
          </div>
        )}

        {reservation?.dispose_types?.includes('general') && (
          <div className="flex items-center gap-2">
            <Trash className="w-10 h-10" strokeWidth={1} />
            <span>일반 쓰레기, 배출</span>
          </div>
        )}
        {reservation?.dispose_types?.includes('food') && (
          <div className="flex items-center gap-2">
            <Apple className="w-10 h-10" strokeWidth={1} />
            <span>음식물 쓰레기, 배출</span>
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold mb-2 mt-4">배출방법</h3>
      {/* <p className="mt-2 text-gray-700">
        {reservation?.dispose_method || "1층 주차장입구옆에 일반/음식물 쓰레기통이 있습니다"}
      </p> */}
    </div>
  );
};

export default TrashInfo;
