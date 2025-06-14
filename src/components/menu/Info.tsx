
import React from 'react';
import { PageHeader } from '../Utils';

const Info = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="리워드 캐시 정보" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
        <div className="bg-blue-500/10 backdrop-blur-md rounded-full p-7 mb-6 border border-white/40 shadow-sm">
          <div className="text-4xl">💰</div>
        </div>
        <h2 className="text-xl font-medium mb-3 text-gray-800">페이지 준비중입니다</h2>
        <p className="text-gray-600 backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm max-w-xs mx-auto">
          더 나은 서비스를 위해 준비 중입니다. 곧 만나뵙겠습니다.
        </p>
      </div>
    </div>
  );
};

export default Info;
