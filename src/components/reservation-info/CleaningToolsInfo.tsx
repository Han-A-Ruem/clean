
import React from "react";
import { cn } from "@/lib/utils";
import { ReservationFormData } from "@/types/reservation";

interface CleaningToolsInfoProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
}

const CleaningToolsInfo: React.FC<CleaningToolsInfoProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
}) => {

  const handleCleaningToolLocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update both UI state and reservation data consistently
    const value = e.target.value;
    onCustomerInfoChange({ supply_location: value });
  };

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update both UI state and reservation data consistently
    const value = e.target.value;
    onCustomerInfoChange({ custom_message: value });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h4 className="pt-2 font-medium text-lg mb-4">청소도구 위치</h4>
        <textarea
          value={customerInfo.supply_location || ""}
          onChange={handleCleaningToolLocationChange}
          placeholder="예)현관 신발장에 있어요."
          className="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-user bg-gray-100"
        />
      </div>
      
      <div className="pt-4">
        <h2 className="text-xl font-semibold mb-2">매니저에게 보내는 메시지</h2>
        <p className="text-[#8E9196] mb-4">청소 시 주의사항이나 요청사항을 남겨주세요</p>
        <textarea
          placeholder="예) 현관 왼쪽에 청소도구가 있어요. 화장실 변기는 특별히 신경써주세요."
          className="min-h-[120px] w-full p-3 text-base border focus:outline-none focus:ring-2 focus:ring-primary-user bg-gray-100"
          value={customerInfo.custom_message || ""}
          onChange={handleCustomMessageChange}
        />
      </div>
    </div>
  );
};

export default CleaningToolsInfo;
