
import React, { useState } from 'react';
import { ArrowLeft, History, Tag, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCoupons } from '@/hooks/useCoupons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { PageHeader } from '@/components/Utils';

// Utility functions to format discount and expiry date
const formatDiscount = (discountType: string, discountValue: number) => {
  return discountType === 'percentage' ? 
    `${discountValue}%` : 
    `${discountValue.toLocaleString()}원`;
};

const formatExpiryDate = (expiryDate: string) => {
  if (!expiryDate) return '';
  
  const date = new Date(expiryDate);
  return `만료일: ${date.toLocaleDateString()}`;
};

const CouponsList: React.FC = () => {
  const navigate = useNavigate();
  const { userCoupons, isLoading, addCouponByCode } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  
  const handleAddCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsAdding(true);
    await addCouponByCode(couponCode);
    setCouponCode('');
    setIsAdding(false);
    setIsInputVisible(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>쿠폰을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
      <div className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button onClick={() => navigate('/more')} className="p-2">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold ml-2">쿠폰</h2>
          </div>
          <button className="flex items-center text-gray-500">
            <History className="h-5 w-5 mr-1" />
            <span>사용내역</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {userCoupons.length === 0 ? (
          <div className="p-8 border rounded-lg text-center bg-white mb-6">
            <p className="text-gray-500">등록된 쿠폰이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {userCoupons.map((userCoupon) => (
              <div
                key={userCoupon.id}
                className={`p-4 border rounded-lg bg-white shadow-sm ${userCoupon.is_used ? 'opacity-70' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${userCoupon.is_used ? 'bg-gray-100' : 'bg-cyan-100'}`}>
                      <Ticket className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{userCoupon.coupon.code}</h3>
                        {userCoupon.is_used && (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            사용됨
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{userCoupon.coupon.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-cyan-500">
                      {formatDiscount(userCoupon.coupon.discount_type, userCoupon.coupon.discount_value)}
                    </span>
                    {userCoupon.coupon.expiry_date && (
                      <span className="text-xs text-gray-500">
                        {formatExpiryDate(userCoupon.coupon.expiry_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">쿠폰 유의사항</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>결제당 1개의 쿠폰만 사용 가능합니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>사용 후 남은 금액은 반환되지 않습니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>정기 서비스 이용 시 유효기간 만료일 기준으로 자동 적용되어 결제됩니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>유효기간 내 사용 가능합니다.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>플러스샵 쿠폰은 청소 서비스에 적용이 불가합니다.</span>
            </li>
          </ul>
        </div>
      </div>
      </div>
        {isInputVisible ? (
        <div className="fixed bottom-0 left-0 right-0 z-20 top-0 bg-white ">
          <div className='border'>
            <PageHeader title="쿠폰 등록하기"  onBack={() => setIsInputVisible(false)}/>
            </div>
          <div className="bg-white p-4  rounded-lg mt-4">
          
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span className="font-medium">쿠폰 등록하기</span>
              </div>
       
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">쿠폰 코드</label>
                <div className="flex space-x-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="쿠폰 코드를 입력하세요"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddCoupon}
                    disabled={!couponCode.trim() || isAdding}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    등록
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                쿠폰 코드를 정확히 입력해 주세요. 대소문자를 구분합니다.
              </p>
            </div>
          </div>
      </div>
        ) : (
          <div className='mx-4 mb-4'>
          <Button 
            onClick={() => setIsInputVisible(true)} 
            className="w-full bg-cyan-500 hover:bg-cyan-600 py-6 text-white"
          >
            쿠폰 등록
          </Button>
          </div>

        )}
    </div>
  );
};

export default CouponsList;
