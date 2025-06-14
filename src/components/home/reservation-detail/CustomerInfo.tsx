
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CustomerData {
  id: string;
  name: string | null;
  email: string | null;
  type: string | null;
}

interface CustomerInfoProps {
  customer: CustomerData | null;
  phoneNumber: number | null;
}

const CustomerInfo = ({ customer, phoneNumber }: CustomerInfoProps) => {
  const { toast } = useToast();

  const handlePhoneCall = () => {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast({
        title: "전화번호가 없습니다",
        description: "고객의 전화번호 정보가 없습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mb-6 p-6 rounded-sm shadow-sm bg-white">
      <h3 className="text-lg font-bold mb-2">고객 정보</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
            <span>{customer?.name?.charAt(0) || '첫'}</span>
          </div>
          <div>
            <p className="font-medium">{customer?.name || "김성연"}(교육용)</p>
            <p className="text-gray-500">첫 방문</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gray-100"
          onClick={handlePhoneCall}
        >
          전화하기
        </Button>
      </div>
    </div>
  );
};

export default CustomerInfo;
