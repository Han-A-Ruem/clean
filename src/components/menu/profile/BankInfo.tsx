
import React from 'react';
import { Input } from '@/components/ui/input';
import { CreditCard } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BankInfoProps {
  userInfo: {
    bankName: string;
    bankAccount: string;
  };
  isEditing: boolean;
  handleChange: (field: string, value: any) => void;
}

export const BankInfo: React.FC<BankInfoProps> = ({
  userInfo,
  isEditing,
  handleChange,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">결제 정보</h2>
        <Separator className="flex-1 ml-3" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>은행명</label>
          </div>
          {isEditing ? (
            <Input
              value={userInfo.bankName}
              onChange={(e) => handleChange('bankName', e.target.value)}
              placeholder="은행명을 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.bankName || "정보 없음"}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="h-4 w-4 mr-2 text-primary-user/70" />
            <label>계좌번호</label>
          </div>
          {isEditing ? (
            <Input
              value={userInfo.bankAccount}
              onChange={(e) => handleChange('bankAccount', e.target.value)}
              placeholder="계좌번호를 입력하세요"
              className="bg-gray-50"
            />
          ) : (
            <div className="p-3 bg-gray-50 rounded-md">
              {userInfo.bankAccount || "정보 없음"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
