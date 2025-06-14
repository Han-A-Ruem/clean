
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReservationData } from "@/types/reservation";
import { Card } from '@/components/ui/card';

interface EntryInfoProps {
  reservation: ReservationData | null;
}

const EntryInfo = ({ reservation }: EntryInfoProps) => {
  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-4">출입방법</h3>
      <div className="space-y-3">
        <Card className="w-full border-primary-user bg-primary-user/5">
          <div className="p-4">
            <p className="font-medium mb-2">공동현관</p>
            <p className="font-medium text-lg">{reservation?.lobby_pass || '******'}</p>
            <p className="text-gray-600 text-sm mt-1">일층에서 공동현관 비번을 누르세요</p>
          </div>
        </Card>
        
        <Card className="w-full border-primary-user bg-primary-user/5">
          <div className="p-4">
            <p className="font-medium mb-2">개별현관</p>
            <p className="font-medium text-lg">{reservation?.unit_pass || '******'}</p>
          </div>
        </Card>
      </div>
      
      <Button variant="outline" className="w-full mt-4 bg-gray-600 text-white">
        출입방법 보기
      </Button>
      <p className="text-red-500 text-sm mt-2">
        ※ 저장 후은 다른 사람에게 알림 시 책임 반을 수 있습니다.
      </p>
    </div>
  );
};

export default EntryInfo;
