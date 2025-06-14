
import React from 'react';
import { ReservationData } from "@/types/reservation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceInfoProps {
  reservation: ReservationData | null;
  isLate: boolean;
  formatTimeRange: () => string;
  formatDuration: () => string;
  handleSendLateNotification: () => Promise<void>;
}

const ServiceInfo = ({ 
  reservation, 
  isLate, 
  formatTimeRange, 
  formatDuration,
  handleSendLateNotification 
}: ServiceInfoProps) => {
  return (
    <>
      <div className="bg-[#3A4374] text-white p-4 flex items-center mx-4 rounded-sm">
        <div className="flex-1">
          <h2 className="font-medium mb-1">청소연구소 클린 캠페인</h2>
          <p className="text-sm">청소연구소는 직거래를 금지합니다.</p>
        </div>
        <Bell className="w-8 h-8 text-red-500" />
      </div>

      <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
        <h2 className="text-lg font-bold mb-2">{reservation?.type || '가정'} 청소</h2>
        <div className="flex justify-between items-center">
          <span>1회</span>
          <span className="text-lg">{reservation?.amount ? `${Math.floor(reservation.amount / 1000)}평 ${reservation.amount.toLocaleString()}원` : "34평 50,400원"}</span>
        </div>
      </div>

      <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
        <h3 className="text-lg font-bold mb-2">업무시간</h3>
        <div className="flex flex-row justify-between items-center">
          <span>
            <p>{formatTimeRange()}</p>
            <p className={`${isLate ? "text-red-500" : "text-cyan-500"}`}>{formatDuration()}</p>
            {isLate && (
              <p className="text-xs text-red-500 mt-1">
                ※ 지각으로 인해 청소 시간이 단축되었습니다
              </p>
            )}
          </span>
      
          <Button 
            variant="destructive" 
            className="rounded-md px-4 py-2"
            onClick={handleSendLateNotification}
            disabled={isLate}
          >
            지각알림
          </Button>
        </div>
      </div>
    </>
  );
};

export default ServiceInfo;
