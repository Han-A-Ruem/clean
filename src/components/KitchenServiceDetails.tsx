
import { ArrowLeft, FlaskConical, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "./Utils";

interface KitchenServiceDetailsProps {
  onBack: () => void;
  onNext: () => void;
}

const KitchenServiceDetails = ({
  onBack,
  onNext
}: KitchenServiceDetailsProps) => {
  const navigate = useNavigate();
  
  const handleNext = () => {
    // Navigate to reservation page when next is clicked
    navigate('/reservation/address');
  };

  return <div className="space-y-6 pb-40">

      <PageHeader title="" rightElement={ <span className="text-teal-600 font-medium flex items-center gap-1 ">
        <span className="w-5 h-5 bg-teal-600 text-white rounded-full text-sm flex items-center justify-center">i</span>
        청소 범위
      </span>

      }/>
      {/* <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
        <ArrowLeft className="w-6 h-6" />
      </button> */}
     

    <div className="space-y-4 px-[16px]">
      <h1 className="text-2xl font-bold">주방 청소 (기본 2시간)</h1>
      <p className="text-gray-600">
        주방청소 설거지, 식탁정리, 가스렌지, 싱크대등 주변부 청소 후 쓰레기 배출로 마무리 합니다.
        후드청소는 별도 신청시 진행하며, 냉장고 청소는 제외됩니다.
      </p>

      <div className="rounded-lg overflow-hidden">
        <img src="/placeholder.svg" alt="Kitchen cleaning" className="w-full h-48 object-cover bg-gray-100" />
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold mb-4">유료 추가</h2>
        <div className="border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FlaskConical />
            </div>
            <div>
              <h3 className="font-medium">후드청소</h3>
              <p className="text-gray-500">30분 추가</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold mb-4">유의사항</h2>
        <ul className="space-y-4 text-gray-600">
          <li>• 실외를 제외한 실내의 주방만을 제공하는 서비스입니다.</li>
          <li>• 식사준비나 저녁 손질 등을 제외한 주방 청소를 진행합니다.</li>
        </ul>
      </div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-10">
      <button onClick={handleNext} className="w-full bg-[#00C7B1] text-white py-4 rounded-lg font-medium">
        다음
      </button>
    </div>
  </div>;
};
export default KitchenServiceDetails;
