
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container px-4 py-6 mx-auto max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/shop')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">주문 완료</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-medium text-gray-800 mb-2">주문이 완료되었습니다</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          주문하신 상품은 빠른 시일 내에 배송될 예정입니다. 주문 내역은 마이페이지에서 확인하실 수 있습니다.
        </p>
        
        <div className="space-y-4 w-full max-w-xs">
          <Button 
            onClick={() => navigate('/shop')} 
            className="w-full bg-[#00C8B0] hover:bg-[#00B09F] text-white"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            쇼핑 계속하기
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/more/orders')} 
            className="w-full"
          >
            주문 내역 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
