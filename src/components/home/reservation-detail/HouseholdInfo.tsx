
import React from 'react';
import { Button } from "@/components/ui/button";
import { Baby, Cat, Dog, FishOff } from "lucide-react";
import { ReservationData } from "@/types/reservation";
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HouseholdInfoProps {
  reservation: ReservationData | null;
}

const HouseholdInfo = ({ reservation }: HouseholdInfoProps) => {
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-4">구성원 정보</h3>
      <div className="space-y-3">
        <Card className={cn(
          "w-full border-gray-200 hover:bg-gray-50 transition-all",
          reservation?.infant ? "border-primary-user bg-primary-user/5" : ""
        )}>
          <div className="flex items-center p-4 gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              reservation?.infant ? "bg-primary-user text-white" : "bg-gray-100"
            )}>
              <Baby className={cn("w-6 h-6", reservation?.infant ? "text-white" : "text-gray-600")} strokeWidth={1.5} />
            </div>
            <span className="flex-grow font-medium">
              영유아(7세 이하), {reservation?.infant ? '있음' : '없음'}
            </span>
          </div>
        </Card>

        <Card className={cn(
          "w-full border-gray-200 hover:bg-gray-50 transition-all",
          reservation?.pet ? "border-primary-user bg-primary-user/5" : ""
        )}>
          <div className="flex items-center p-4 gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              reservation?.pet ? "bg-primary-user text-white" : "bg-gray-100"
            )}>
              {reservation?.pet === 'cat' && <Cat className="w-6 h-6 text-white" strokeWidth={1.5} />}
              {reservation?.pet === 'dog' && <Dog className="w-6 h-6 text-white" strokeWidth={1.5} />}
              {!reservation?.pet && <FishOff className="w-6 h-6 text-gray-600" strokeWidth={1.5} />}
            </div>
            <span className={cn("flex-grow font-medium", reservation?.pet ? "text-cyan-500" : "")}>
              {reservation?.pet === 'cat' ? '고양이' : reservation?.pet === 'dog' ? '강아지' : '반려동물'},
              {reservation?.pet ? '있음' : '없음'}
            </span>
            {reservation?.pet && (
              <Button variant="outline" size="sm">채팅</Button>
            )}
          </div>
        </Card>
      </div>
      
      <div className="p-4 mt-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700">
          안전을 위해 영유아/반려동물에 대한 가이드 숙지 후 서비스를 진행해 주세요.
        </p>
        <Button variant="link" className="text-cyan-500 p-0 h-auto">
          안전 가이드 보기
        </Button>
      </div>
    </div>
  );
};

export default HouseholdInfo;
