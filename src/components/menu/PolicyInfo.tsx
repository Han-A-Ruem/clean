
import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '../Utils';

const PolicyInfo = () => {
  const navigate = useNavigate();

  return (
    <div className=" pb-20">
    <PageHeader title='정책 및 앱 정보'/>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="bg-gray-100 rounded-full p-6 mb-6">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium mb-2">정책 및 앱 정보 준비 중</h2>
        <p className="text-gray-500 mb-6">
          곧 더 자세한 정책 정보와 앱 관련 정보가 제공될 예정입니다.
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

export default PolicyInfo;
