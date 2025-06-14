
import React from 'react';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';

const ActivityGuide = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20">
      <PageHeader title="활동 안내" />
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="bg-gray-100/30 backdrop-blur-md rounded-full p-6 mb-6 border border-white/40 shadow-sm">
          <Info className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">활동 안내 준비 중</h2>
        <p className="text-gray-500 mb-6 backdrop-blur-xl bg-white/60 p-4 rounded-xl border border-white/30 shadow-sm">
          곧 더 많은 활동 안내와 도움말이 제공될 예정입니다.
          조금만 기다려주세요!
        </p>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mt-4 backdrop-blur-md bg-white/70 border border-white/40 hover:bg-white/80 transition-all"
        >
          돌아가기
        </Button>
      </div>
    </div>
  );
};

export default ActivityGuide;
