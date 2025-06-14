
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../Utils';

const TermsAndPolicies = () => {
  const navigate = useNavigate();

  const terms = [
    {
      id: 'terms-of-use',
      title: '이용약관',
      route: '/more/terms-policies/terms-of-use'
    },
    {
      id: 'privacy-policy',
      title: '개인정보처리방침',
      route: '/more/terms-policies/privacy-info'
    },
    {
      id: 'business-info',
      title: '사업자 정보',
      route: '/more/terms-policies/business-info'
    }
  ];

  return (
    <div className="pb-20">
      <PageHeader title="약관 및 정책" />
      
      <div className="mt-4 bg-white divide-y">
        {terms.map((term) => (
          <div 
            key={term.id}
            className="flex items-center justify-between p-5 cursor-pointer"
            onClick={() => navigate(term.route)}
          >
            <span className="text-md font-medium">{term.title}</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsAndPolicies;
