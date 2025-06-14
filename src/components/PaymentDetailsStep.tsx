
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingProgress from "./BookingProgress";

interface PaymentDetailsStepProps {
  onBack: () => void;
  onNext: () => void;
  selectedService: string | null;
}

const PaymentDetailsStep = ({
  onBack,
  onNext,
  selectedService
}: PaymentDetailsStepProps) => {
  return <div className="min-h-screen bg-white pb-24">
      <div className="p-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 space-y-6">
        <h1 className="text-2xl font-bold">결제 상세</h1>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="font-medium">결제 금액</h2>
            <div className="flex justify-between items-center">
              <span>기본 요금</span>
              <span>37,700원</span>
            </div>
            <div className="flex justify-between items-center text-[#00C8B0]">
              <span>첫 예약 할인 20%</span>
              <span>-7,540원</span>
            </div>
            <div className="pt-4 border-t flex justify-between items-center font-medium">
              <span>최종 결제 금액</span>
              <span>30,160원</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h2 className="font-medium">결제 수단</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>신용/체크카드</span>
                <span>30,160원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingProgress currentStep="payment_details" selectedService={selectedService} />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
        <Button onClick={onNext} className="w-full bg-[#00C8B0] hover:bg-[#00C8B0]/90 text-white py-6 text-base">
          다음
        </Button>
      </div>
    </div>;
};

export default PaymentDetailsStep;
