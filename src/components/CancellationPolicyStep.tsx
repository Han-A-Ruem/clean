import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
interface CancellationPolicyStepProps {
  onBack: () => void;
  onNext: () => void;
  calculatePrice: () => string;
}
const CancellationPolicyStep = ({
  onBack,
  onNext,
  calculatePrice
}: CancellationPolicyStepProps) => {
  return <div className="min-h-screen bg-white pb-24">
      <div className="p-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-4 space-y-6">
        <h1 className="text-xl font-medium">식사를 위한 휴게 시간 제공을 부탁드립니다.</h1>

        <div className="space-y-4 text-gray-600">
          <p className="leading-relaxed">
            서비스 당일 고객님과 연락이 닿지 않아 입실하지 못하는 경우 30분 대기 후 철수합니다. 미리 출입방법을 꼭 확인해 주세요.
          </p>
          <p className="text-gray-400">(당일 취소로 30% 취소수수료 부과)</p>

          <p className="leading-relaxed">
            표준서비스 시간이 부족한 경우 시간추가 의향을 여쭤볼 수 있습니다. 오염도가 매우 심한 경우 매니저님의 판단에 따라 서비스를 제공하지 못할 수 있습니다.
          </p>

          <p>서비스 전날 6시 이후부터는 결제금액의 30% 취소 수수료가 발생합니다.</p>

          <div className="pt-2">
            <h2 className="font-medium text-black underline decoration-2 underline-offset-4 mb-4">
              취소 수수료 정책안내
            </h2>
            <p className="leading-relaxed">
              청소연구소 가사서비스는 가사도우미를 중개해 드리는 고용알선업으로서 부가세 발생 면세사업에 해당합니다. 따라서 부가세 매입세액 공제를 받으시면 안 되는 점 유의해 주세요.
            </p>
          </div>

          <p className="leading-relaxed">
            정기 할인은 서비스를 최소 2회 이상 받아야 적용됩니다. 1회만 받고 정기 서비스를 취소하시는 경우 정기 할인에 따른 할인 위약금이 등록하신 카드로 자동 결제됩니다.
          </p>

          <p className="text-rose-500 leading-relaxed">
            매니저가 직가래를 요구하면 피해 상황이 발생할 수 있으니 주의하세요. 이 경우 즉시 고객센터로 신고해 주세요.
          </p>

          <div className="mt-8 bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
              <path d="M3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V21L12 17L3 21Z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-600">위 내용을 확인하였으며 예약시 동의 하신걸로 간주합니다.</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold">{calculatePrice()}</p>
            <button className="text-sm text-gray-500">자세히</button>
          </div>
          <Button onClick={onNext} className="bg-[#00C8B0] hover:bg-[#00C8B0]/90 text-white px-8 py-3 rounded-lg">
            다음
          </Button>
        </div>
      </div>
    </div>;
};
export default CancellationPolicyStep;