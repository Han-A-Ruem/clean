import { ArrowLeft } from "lucide-react";
import BookingProgress from "./BookingProgress";
interface DisposalInstructionsStepProps {
  onBack: () => void;
  onNext: () => void;
  handleDisposeInstruction: (instruction: string) => void;
  handleSupplyLocation: (location: string) => void;
  currentStep: "disposal";
  selectedService: string | null;
  calculatePrice: () => string;
}
const DisposalInstructionsStep = ({
  onBack,
  onNext,
  handleDisposeInstruction,
  handleSupplyLocation,
  currentStep,
  selectedService,
  calculatePrice
}: DisposalInstructionsStepProps) => {
  return <div className="min-h-screen bg-white pb-24">
      <div className="p-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 space-y-8">
        <h1 className="text-2xl font-bold leading-tight">
          쓰레기 배출 방법 및<br />
          주의사항을 입력해 주세요.
        </h1>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-medium">화장실 쓰레기 배출 방법</h2>
            <textarea placeholder="예)락스는 쓰지 말아주세요." className="w-full min-h-[120px] p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" onChange={e => handleDisposeInstruction(e.target.value)} />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">전달사항 및 청소용품 위치</h2>
            <p className="text-gray-600">매니저님이 알고 있어야 할 내용을 적어 주세요.</p>
            <p className="text-[#00C8B0]">서비스 범위 외의 요청사항은 제외될 수 있습니다.</p>
            <textarea placeholder="예)분류한 반찬은 그대로 놓아두세요." className="w-full min-h-[120px] p-4 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" onChange={e => handleSupplyLocation(e.target.value)} />
          </div>
        </div>
      </div>

<div className="flex flex-col fixed bottom-0 left-0 right-0  z-10">
<BookingProgress currentStep={currentStep} selectedService={selectedService} />
  <div className="container mx-auto px-4 py-4 flex items-center justify-between bg-white border-t border-gray-100 ">
        <div>
          <p className="text-xl font-semibold">{calculatePrice()}</p>
          <button className="text-sm text-gray-500">자세히</button>
        </div>
        <button onClick={onNext} className="bg-[#00C8B0] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
          다음
        </button>
      </div>
</div>
      
    </div>;
};
export default DisposalInstructionsStep;