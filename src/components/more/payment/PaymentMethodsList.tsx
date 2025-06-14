
import React from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit,
  Check,
  ChevronRight,
  BadgeDollarSign,
  Wallet,
  ArrowLeft
} from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { PaymentMethodData } from '@/types/billing';
import { PageHeader } from '@/components/Utils';

const PaymentMethodsList: React.FC = () => {
  const {
    paymentMethods,
    isLoading,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = usePaymentMethods();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>결제 수단을 불러오는 중...</p>
      </div>
    );
  }

  const getPaymentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5" />;
      case 'bank_account':
        return <Wallet className="h-5 w-5" />;
      case 'kakao_pay':
      case 'naver_pay':
      case 'toss_pay':
        return <BadgeDollarSign className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    const last4 = cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const getPaymentDescription = (method: PaymentMethodData) => {
    if (method.payment_type === 'credit_card') {
      return formatCardNumber(method.card_number);
    }
    if (method.payment_type === 'bank_account') {
      return `${method.bank_name} ${method.account_number ? '•••• •••• ' + method.account_number.slice(-4) : ''}`;
    }
    return method.name;
  };

  return (
    <div className=" space-y-4 relative">

      <PageHeader title="결제 수단 관리"  rightElement={<Button
            onClick={() => navigate('/more/payment/add')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> 추가
          </Button>}/>
      <div className='mt-4 space-y-4 px-4'>

    

      {paymentMethods.length === 0 ? (
        <div className="p-6 border rounded-lg text-center bg-gray-50">
          <p className="text-gray-500">등록된 결제 수단이 없습니다</p>
          <Button
            onClick={() => navigate('/more/payment/add')}
            className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-white "
          >
            <Plus className="h-4 w-4 mr-2" /> 결제 수단 추가
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${method.is_default ? 'bg-cyan-100' : 'bg-gray-100'}`}>
                    {getPaymentIcon(method.payment_type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{method.name}</h3>
                      {method.is_default && (
                        <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded-full">
                          기본
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{getPaymentDescription(method)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/more/payment/edit/${method.id}`)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {!method.is_default && (
                    <>
                      <button
                        onClick={() => setDefaultPaymentMethod(method.id)}
                        className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-gray-100 rounded-full"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deletePaymentMethod(method.id)}
                        className="p-2 text-gray-500 hover:text-rose-600 hover:bg-gray-100 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};

export default PaymentMethodsList;
