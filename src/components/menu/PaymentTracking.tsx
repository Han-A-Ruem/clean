
import React from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';

const PaymentTracking = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <PageHeader title='수입 추적'/>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <Wallet className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">수입 추적 준비 중</h2>
        <p className="text-gray-500 mb-6">
          곧 수입 추적 및 통계 기능이 제공될 예정입니다.
          조금만 기다려주세요!
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          돌아가기
        </Button>
      </div>
    </div>
  );
};

export default PaymentTracking;
