
import React from 'react';
import { PageHeader } from '../Utils';

const PrivacyPolicy = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50/80">
      <PageHeader title="개인정보처리방침" className="backdrop-blur-lg bg-white/70 border-b border-white/30" />
      <div className="p-5">
        <div className="backdrop-blur-md bg-white/70 p-5 rounded-2xl border border-white/40 shadow-sm">
          <h2 className="text-xl font-medium text-gray-800 mb-5">개인정보처리방침</h2>
          <div className="space-y-4 text-gray-700">
            <p>개인정보처리방침 내용이 여기에 표시됩니다.</p>
            <p className="bg-gray-50/80 p-3 rounded-xl">개인정보 수집 및 이용에 관한 중요 사항이 기재되어 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
