
import React from 'react';
import { PageHeader } from '../Utils';

const BusinessInfo = () => {
  return (
    <div className="pb-20">
      <PageHeader title="사업자 정보" />
      <div className="p-4 space-y-4">
        <div className="border-b pb-4">
          <p className="text-gray-800 text-md">
          바쁠때 | 서울특별시 성동구 성수일로 8길 55, A동 805호(성수동2가)
          </p>
        </div>
        
        <div className="space-y-3 py-2">
          <div className="flex flex-col">
            <p className="text-gray-800">사업자등록번호 : 601-11-73302</p>
          </div>
          
          <div className="flex flex-col">
            <p className="text-gray-800">통신판매업신고 : 2023-서울금천-2532</p>
          </div>
          
          <div className="flex flex-col">
            <p className="text-gray-800">대표 :  한아름 | 개인정보책임자 : 한아름</p>
          </div>
          
          <div className="flex flex-col">
            <p className="text-gray-800">이메일 : bbeul001@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfo;
