import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShieldEllipsis } from "lucide-react";

const ApprovalMessage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50/80">
      <div className="w-full max-w-md space-y-8 text-center backdrop-blur-md bg-white/70 p-8 rounded-2xl border border-white/40 shadow-sm">
        <div className="text-center">
          <ShieldEllipsis className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-4">승인 대기중</h2>
          <p className="text-gray-600 mb-6">
            관리자의 승인 후 서비스 이용이 가능합니다.
          </p>
          <p className="text-gray-500 text-sm">
            승인 완료 시 별도로 안내 메시지가 발송됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApprovalMessage;
