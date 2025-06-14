
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Wallet, BadgeDollarSign } from 'lucide-react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethodFormData } from '@/types/billing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentMethodFormProps {
  initialData?: PaymentMethodFormData & { id?: string };
  isEdit?: boolean;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ 
  initialData, 
  isEdit = false 
}) => {
  const [data, setData] = useState<PaymentMethodFormData>(
    initialData || {
      name: '',
      payment_type: 'credit_card',
      card_number: '',
      card_holder: '',
      expiration_date: '',
      security_code: '',
      is_default: false,
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPaymentMethod, updatePaymentMethod } = usePaymentMethods();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setData({ ...data, [name]: target.checked });
    } else {
      setData({ ...data, [name]: value });
    }
    
    // Clear fields when payment type changes
    if (name === 'payment_type') {
      if (value === 'credit_card') {
        setData({
          ...data,
          payment_type: value,
          bank_name: undefined,
          account_number: undefined,
          account_holder: undefined,
        });
      } else if (value === 'bank_account') {
        setData({
          ...data,
          payment_type: value,
          card_number: undefined,
          card_holder: undefined,
          expiration_date: undefined,
          security_code: undefined,
        });
      } else {
        // For digital wallets like KakaoPay, etc.
        setData({
          ...data,
          payment_type: value,
          card_number: undefined,
          card_holder: undefined,
          expiration_date: undefined,
          security_code: undefined,
          bank_name: undefined,
          account_number: undefined,
          account_holder: undefined,
        });
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const groups = [];
    
    for (let i = 0; i < digits.length; i += 4) {
      groups.push(digits.slice(i, i + 4));
    }
    
    return groups.join(' ').trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setData({ ...data, card_number: formatted });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formatted = value;
      if (value.length > 2) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setData({ ...data, expiration_date: formatted });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isEdit && initialData?.id) {
        await updatePaymentMethod(initialData.id, data);
      } else {
        await addPaymentMethod(data);
      }
      navigate('/more/payment');
    } catch (error) {
      console.error('Error saving payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center p-4">
          <button onClick={() => navigate('/more/payment')} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-lg font-medium">
            {isEdit ? '결제 수단 수정' : '결제 수단 추가'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            결제 수단 종류
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setData({ ...data, payment_type: 'credit_card' })}
              className={`py-3 px-4 border rounded-lg flex flex-col items-center justify-center ${
                data.payment_type === 'credit_card'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200'
              }`}
            >
              <CreditCard className={`h-6 w-6 ${
                data.payment_type === 'credit_card' ? 'text-cyan-500' : 'text-gray-500'
              }`} />
              <span className="mt-1 text-sm">카드</span>
            </button>
            <button
              type="button"
              onClick={() => setData({ ...data, payment_type: 'bank_account' })}
              className={`py-3 px-4 border rounded-lg flex flex-col items-center justify-center ${
                data.payment_type === 'bank_account'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200'
              }`}
            >
              <Wallet className={`h-6 w-6 ${
                data.payment_type === 'bank_account' ? 'text-cyan-500' : 'text-gray-500'
              }`} />
              <span className="mt-1 text-sm">계좌</span>
            </button>
            <button
              type="button"
              onClick={() => setData({ ...data, payment_type: 'kakao_pay' })}
              className={`py-3 px-4 border rounded-lg flex flex-col items-center justify-center ${
                data.payment_type === 'kakao_pay'
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200'
              }`}
            >
              <BadgeDollarSign className={`h-6 w-6 ${
                data.payment_type === 'kakao_pay' ? 'text-cyan-500' : 'text-gray-500'
              }`} />
              <span className="mt-1 text-sm">간편결제</span>
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            결제 수단 이름
          </label>
          <Input
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="개인 카드, 기업 계좌 등"
            required
          />
        </div>

        {data.payment_type === 'credit_card' && (
          <>
            <div>
              <label htmlFor="card_number" className="block text-sm font-medium mb-2">
                카드 번호
              </label>
              <Input
                id="card_number"
                name="card_number"
                value={data.card_number || ''}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                required
              />
            </div>
            <div>
              <label htmlFor="card_holder" className="block text-sm font-medium mb-2">
                카드 소유자 이름
              </label>
              <Input
                id="card_holder"
                name="card_holder"
                value={data.card_holder || ''}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiration_date" className="block text-sm font-medium mb-2">
                  만료일 (MM/YY)
                </label>
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  value={data.expiration_date || ''}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label htmlFor="security_code" className="block text-sm font-medium mb-2">
                  보안 코드 (CVC)
                </label>
                <Input
                  id="security_code"
                  name="security_code"
                  value={data.security_code || ''}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
          </>
        )}

        {data.payment_type === 'bank_account' && (
          <>
            <div>
              <label htmlFor="bank_name" className="block text-sm font-medium mb-2">
                은행명
              </label>
              <select
                id="bank_name"
                name="bank_name"
                value={data.bank_name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">은행을 선택하세요</option>
                <option value="KB국민은행">KB국민은행</option>
                <option value="신한은행">신한은행</option>
                <option value="우리은행">우리은행</option>
                <option value="하나은행">하나은행</option>
                <option value="농협은행">농협은행</option>
                <option value="기업은행">기업은행</option>
                <option value="카카오뱅크">카카오뱅크</option>
                <option value="케이뱅크">케이뱅크</option>
                <option value="토스뱅크">토스뱅크</option>
              </select>
            </div>
            <div>
              <label htmlFor="account_number" className="block text-sm font-medium mb-2">
                계좌번호
              </label>
              <Input
                id="account_number"
                name="account_number"
                value={data.account_number || ''}
                onChange={(e) => setData({ 
                  ...data, 
                  account_number: e.target.value.replace(/\D/g, '') 
                })}
                placeholder="숫자만 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="account_holder" className="block text-sm font-medium mb-2">
                예금주
              </label>
              <Input
                id="account_holder"
                name="account_holder"
                value={data.account_holder || ''}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            </div>
          </>
        )}

        {data.payment_type === 'kakao_pay' && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              카카오페이를 선택하셨습니다. 추가 정보는 필요하지 않습니다.
            </p>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={!!data.is_default}
            onChange={(e) => setData({ ...data, is_default: e.target.checked })}
            className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
          />
          <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
            기본 결제 수단으로 설정
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : isEdit ? '수정 완료' : '추가하기'}
        </Button>
      </form>
    </div>
  );
};

export default PaymentMethodForm;
