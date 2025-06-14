
import React from 'react';
import { PageHeader } from '../Utils';

const LocationPolicy = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="위치정보" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="p-5">
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-5">위치정보 이용 안내</h2>
          <div className="space-y-4 text-gray-700">
            <p>위치정보 관련 내용이 여기에 표시됩니다.</p>
            <p className="bg-gray-50/80 p-3 rounded-xl">위치정보 사용 방법 및 보호에 관한 정책을 확인하세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPolicy;
