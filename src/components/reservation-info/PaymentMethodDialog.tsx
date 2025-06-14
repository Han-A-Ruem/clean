
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Wallet, BadgeDollarSign, X, Plus } from "lucide-react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { PaymentMethodData } from "@/types/billing";
import { useNavigate } from "react-router-dom";

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PaymentMethodDialogProps {
  selectedPaymentMethod: PaymentMethod | null;
  onSelectPaymentMethod: (paymentMethod: PaymentMethod | null) => void;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  selectedPaymentMethod,
  onSelectPaymentMethod,
}) => {
  const [open, setOpen] = useState(false);
  const [localSelectedMethod, setLocalSelectedMethod] = useState<PaymentMethod | null>(selectedPaymentMethod);
  const { paymentMethods, isLoading } = usePaymentMethods();
  const navigate = useNavigate();

  // Convert Supabase payment methods to UI payment methods
  const mapToPaymentMethod = (method: PaymentMethodData): PaymentMethod => {
    let icon = <CreditCard className="w-5 h-5" />;
    let description = "카드";
    
    if (method.payment_type === 'credit_card') {
      icon = <CreditCard className="w-5 h-5" />;
      description = method.card_number ? `**** **** **** ${method.card_number.slice(-4)}` : "신용/체크카드";
    } else if (method.payment_type === 'bank_account') {
      icon = <Wallet className="w-5 h-5" />;
      description = `${method.bank_name} ${method.account_number ? `**** ${method.account_number.slice(-4)}` : ""}`;
    } else if (method.payment_type === 'kakao_pay') {
      icon = <BadgeDollarSign className="w-5 h-5" />;
      description = "카카오페이";
    }
    
    return {
      id: method.id,
      name: method.name,
      icon,
      description
    };
  };

  const convertedPaymentMethods = paymentMethods.map(mapToPaymentMethod);

  // Fallback to original payment methods if no saved methods exist
  const displayPaymentMethods = convertedPaymentMethods.length > 0 
    ? convertedPaymentMethods 
    : [
        {
          id: "1",
          name: "신용/체크카드",
          icon: <CreditCard className="w-5 h-5" />,
          description: "모든 카드사 지원",
        },
        {
          id: "2",
          name: "카카오페이",
          icon: <Wallet className="w-5 h-5" />,
          description: "간편하고 빠른 결제",
        },
        {
          id: "3",
          name: "네이버페이",
          icon: <BadgeDollarSign className="w-5 h-5" />,
          description: "네이버페이 포인트 적립",
        },
        {
          id: "4",
          name: "토스페이",
          icon: <CreditCard className="w-5 h-5" />,
          description: "토스페이로 빠른 결제",
        },
      ];

  const handleSelect = (method: PaymentMethod) => {
    setLocalSelectedMethod(method);
  };

  const handleRemove = () => {
    setLocalSelectedMethod(null);
  };

  const handleApply = () => {
    onSelectPaymentMethod(localSelectedMethod);
    setOpen(false);
  };

  const handleAddPaymentMethod = () => {
    setOpen(false);
    navigate('/more/payment/add');
  };

  useEffect(() => {
    // If there are saved payment methods and none is selected, select the default one
    if (convertedPaymentMethods.length > 0 && !localSelectedMethod) {
      const defaultMethod = paymentMethods.find(method => method.is_default);
      if (defaultMethod) {
        setLocalSelectedMethod(mapToPaymentMethod(defaultMethod));
      }
    }
  }, [paymentMethods]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white">
          {selectedPaymentMethod ? "변경" : "등록"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogTitle>결제 수단 선택</DialogTitle>
        
        {isLoading ? (
          <div className="py-4 text-center">
            <p>결제 수단을 불러오는 중...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 my-4">
              {displayPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg flex items-center justify-between cursor-pointer ${
                    localSelectedMethod?.id === method.id
                      ? "border-cyan-500"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelect(method)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  {localSelectedMethod?.id === method.id && (
                    <Check className="text-cyan-500 w-5 h-5" />
                  )}
                </div>
              ))}
              
              {paymentMethods.length > 0 && (
                <button
                  onClick={handleAddPaymentMethod}
                  className="w-full p-4 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <Plus className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">결제 수단 추가</span>
                </button>
              )}
            </div>
            
            {localSelectedMethod && (
                <div 
                  className="p-3 border border-rose-300 rounded-lg flex items-center justify-between cursor-pointer bg-rose-50 hover:bg-rose-100"
                  onClick={handleRemove}
                >
                  <div className="flex items-center gap-2">
                    <X className="text-rose-500 w-5 h-5" />
                    <p className="font-medium text-rose-500">결제 수단 제거</p>
                  </div>
                </div>
              )}
            
            <Button
              onClick={handleApply}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              확인
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentMethodDialog;
