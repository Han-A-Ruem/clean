
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TermsStepProps {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  onSubmit: () => void;
}

const TermsStep = ({ agreed, setAgreed, onSubmit }: TermsStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">회원가입 약관에</h1>
        <h1 className="text-2xl font-bold">동의해 주세요.</h1>
      </div>
      
      <p className="text-sm text-muted-foreground">
        청소연구소 매니저용 서비스는 회원들의 개인정보를 안전하게 취급하는데 최선을 다합니다.
      </p>

      <div className="space-y-4">
        <div className="border border-primary-cleaner rounded-lg p-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 bg-primary-cleaner "
            />
            <span className="text-base">모두 확인, 동의합니다.</span>
          </label>
        </div>

        <p className="text-sm text-muted-foreground">
          전체 동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로 동의를 선택하실 수 있습니다.
          선택항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다.
        </p>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary"
              />
              <span className="text-sm">(필수)청소연구소 매니저용 이용약관</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 bg-primary-cleaner hover:bg-primary-cleaner"
              />
              <span className="text-sm">(필수)개인정보 수집 및 이용동의</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 bg-primary-cleaner hover:bg-primary-cleaner"
              />
              <span className="text-sm">(선택)마케팅 정보 수신동의</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <Button 
        className="w-full  bg-primary-cleaner hover:bg-primary-cleaner" 
        onClick={onSubmit}
      >
        회원 가입
      </Button>
    </div>
  );
};

export default TermsStep;
