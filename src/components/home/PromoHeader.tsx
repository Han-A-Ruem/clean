
import { Sparkles, Home, Clock } from "lucide-react";

interface PromoHeaderProps {
  showPromotionalHeader: boolean;
}

const PromoHeader = ({ showPromotionalHeader }: PromoHeaderProps) => {
  if (!showPromotionalHeader) return null;
  
  return (
    <div>
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 mb-8">
        <div className="container px-4 py-8 mx-auto max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              첫 예약 고객 20% 할인!
            </h2>
            <p className="text-muted-foreground">
              3월 한정 특별 프로모션으로 더 저렴하게 이용하세요
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>첫 예약 20% 할인</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                <span>전문가 방문 청소</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>원하는 시간 예약</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          청소 서비스 예약
        </h1>
        <p className="text-muted-foreground text-lg">
          신뢰할 수 있는 청소 서비스를 예약하세요
        </p>
      </div>
    </div>
  );
};

export default PromoHeader;
