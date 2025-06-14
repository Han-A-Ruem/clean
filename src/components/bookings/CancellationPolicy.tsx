
import React from "react";
import { X } from "lucide-react";

interface CancellationPolicyProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CancellationPolicy: React.FC<CancellationPolicyProps> = ({ 
  open, 
  onOpenChange 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center h-full">
      <div className="bg-white w-full max-w-md overflow-y-auto h-full max-h-[100vh]">
        <div className="p-6">
        <button 
              onClick={() => onOpenChange(false)}
              className="ml-auto"
            >
              <X className="h-5 w-5" />
            </button>
          <div className="flex items-center mb-6 mt-7">
            <h2 className="text-xl font-bold">취소 수수료 정책 안내</h2>
          
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">취소 수수료 산정 기준</h3>
              <p className="text-gray-700">
                취소 수수료는 총 가격을 기준으로 30%가 부과됩니다.
                (총 가격은 쿠폰 할인 전 실제 서비스 비용을 기준으로 
                책정됩니다.)
              </p>
              <p className="text-gray-700 mt-4">
                취소 수수료는 당일 업무를 못하시게 된 매니저님에게
                보상으로 지급됩니다.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">서비스 당일 고객 노쇼 시 대응 및 취소수수료 정책</h3>
              <p className="text-gray-700">
                서비스 당일에 고객님과 연락이 되지 않아 매니저님이
                정상적으로 업무를 진행하지 못하는 경우에는 서비스 시
                작시간 기준으로 30분을 대기하고 철수하는 것을 원칙
                으로 합니다. 이 경우 당일 노쇼로 인한 취소로 처리되어
                동일하게 30% 취소 수수료가 부과됩니다.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">고객 요청으로 인한 서비스 중단 시 환불 정책</h3>
              <p className="text-gray-700">
                업무가 시작된 이후에 고객님의 사정으로 서비스를 중단
                요청하시는 경우에는 환불이 되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
