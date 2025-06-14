
import React from "react";
import { Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface CautionSectionProps {
  termsAgreed: boolean;
  onTermsAgreementChange: (checked: boolean) => void;
}

const CautionSection: React.FC<CautionSectionProps> = ({ 
  termsAgreed, 
  onTermsAgreementChange 
}) => {
  return (
    <>
      <div className="border-t border-gray-200 pt-4 px-4">
        <h2 className="text-xl font-bold mb-4">유의사항</h2>
        <ul className="space-y-4 text-gray-600">
          <li className="flex gap-2">
            <span>•</span>
            <p>귀중품, 현금, 상품권 분실 및 파손 시, 보험처리가 불가능하며 이에 대해 책임지지 않습니다. 반드시 미리 안전한 곳에 보관해 주세요.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>미술품, 골동품 등의 가치환산이 어려운 제품은 파손사고 발생 시 보험 처리가 불가합니다. 서비스 진행 전 매니저님께 별도로 주의해달라고 말씀해 주시거나 앞에 가리개 주세요.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>반려동물이 있는 경우 안전장치를 해주세요.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>반려동물이 머무는 공간일 경우 반려동물 체크를 해주세요.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>6시간 이상 서비스의 경우 매니저님께 30분 정도의 식사를 위한 휴게 시간 제공을 부탁드립니다.</p>
          </li>
          <li className="flex flex-col">
            <span className="flex gap-2">•<p>서비스 당일 고객님과 연락이 닿지 않아 입실하지 못하는 경우 30분 대기 후 철수합니다. 미리 출입방법을 꼭 확인해 주세요.</p></span>
            <p className="text-gray-400 ml-3">(당일 취소로 30% 취소수수료 부과)</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>표준서비스 시간이 부족한 경우 시간추가 의향을 여쭤볼 수 있습니다. 오염도가 매우 심한 경우, 매니저님의 판단에 따라 서비스를 제공하지 못할 수 있습니다.</p>
          </li>
          <li className="flex flex-col">
            <span className="flex gap-2">•<p>서비스 전날 6시 이후부터는 결제금액의 30% 취소 수수료가 발생합니다.</p></span>
            <p className="font-bold underline ml-4">취소 수수료 정책안내</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>청소연구소 가사서비스는 가사도우미를 중개해 드리는 고용알선업으로서 부가세 발생 면세사업에 해당합니다. 따라서 부가세 매입세액 공제를 받으시면 안 되는 점 유의해 주세요.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p>정기 할인은 서비스를 최소 2회 이상 받아야 적용됩니다. 1회만 받고 정기 서비스를 취소하시는 경우 정기 할인에 따른 할인 위약금이 등록하신 카드로 자동 결제됩니다.</p>
          </li>
          <li className="flex gap-2">
            <span>•</span>
            <p className="text-red-500">매니저가 직가래를 요구하면 피해 상황이 발생할 수 있으니 주의하세요. 이 경우 즉시 고객센터로 신고해 주세요.</p>
          </li>
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg flex items-start gap-3 mt-4 mx-4">
        <Checkbox 
          id="terms-agreement" 
          checked={termsAgreed}
          onCheckedChange={onTermsAgreementChange}
          className="mt-1 border-gray-400 data-[state=checked]:bg-primary-user data-[state=checked]:border-primary-user"
        />
        <label 
          htmlFor="terms-agreement" 
          className="cursor-pointer"
        >
          위 내용을 확인하였으며 예약시 동의 하신걸로 간주합니다.
        </label>
      </div>
    </>
  );
};

export default CautionSection;
