
import React from 'react';
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const SupportButtons = () => {
  return (
    <>
      <div className="my-6 rounded-r shadow-sm">
        <Button variant="outline" className="w-full rounded-t-sm rounded-b-none flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          회사에 전화하기
        </Button>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-b-sm rounded-t-none">
          <MessageCircle className="w-4 h-4" />
          회사와 채팅하기
        </Button>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-center text-gray-500 text-sm">
          전화상담 : 평일/토요일 오전 8시~오후 6시
        </p>
        <p className="text-center text-gray-500 text-sm">
          긴급한 건은 새벽으로 남겨주시면 업무시간에 빠르게 처리하겠습니다.
        </p>
      </div>
    </>
  );
};

export default SupportButtons;
