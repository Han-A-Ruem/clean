import React, { useState } from "react";
import { ArrowLeft, AlertCircle, Tag, Wallet, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerInfo } from "@/types/booking";
import { formatDate } from "@/components/home/DateUtils";
import CouponSelectionDialog, { Coupon } from "./CouponSelectionDialog";
import PointsSelectionDialog from "./PointsSelectionDialog";
import { useUser } from "@/contexts/UserContext";
import PaymentMethodDialog, { PaymentMethod } from "./PaymentMethodDialog";
import { PageHeader } from "../Utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TossPaymentDialog } from "./TossPaymentDialog";
import { Reservation } from "@/model/Reservation";
import { formatKoreanWon } from "@/utils/formatters";

interface ReservationConfirmationProps {
  customerInfo: Reservation;
  onBack: () => void;
  onComplete: () => void;
  price?: string;
  title?: string;
  date?: string;
  time?: string;
}

const ReservationConfirmation: React.FC<ReservationConfirmationProps> = ({
  customerInfo,
  onBack,
  onComplete,
  price = "30,160원",
  title = "매주 화요일",
  date,
  time,
}) => {
  const { userData, fetchUserData } = useUser();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [prioritizePoints, setPrioritizePoints] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [selectedPoints, setSelectedPoints] = useState<number>(0);
  const [isBusinessEntity, setIsBusinessEntity] = useState(false);
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState<string>(
    userData?.business_registration_number || ""
  );


  const formattedDate = date || (customerInfo.date ? formatDate(customerInfo.date) : "날짜 미지정");
  const formattedTime = time || customerInfo.time || "시간 미지정";

  const calculatePointsDiscount = (points: number): number => {
    if (points <= 0) return 0;
    // 1 point = 1 won conversion
    return points;
  };

  const onReservationComplete = async () => {
    // Handle reservation completion logic here
    if (userData?.business_registration_number == null && businessRegistrationNumber !== userData.business_registration_number) {
      try {
        const { error, data } = await supabase
          .from('users')
          .update({
            business_registration_number: businessRegistrationNumber,
          })
          .eq('user_id', userData.user_id);

        if (error) throw error;

        toast({
          title: "프로필 업데이트 완료",
          description: "프로필이 성공적으로 업데이트되었습니다.",
        });

        // Refresh user data
        if (fetchUserData) {
          fetchUserData(userData.user_id);
        }

      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: error.message,
        });
      }

    }
    onComplete();
  }

  // Calculate all price values as numbers first
  const originalAmount = Number(customerInfo.amount) || 0;
  
  // Calculate coupon discount amount
  let couponDiscountAmount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discount.includes("%")) {
      // Calculate percentage discount
      const percentage = parseInt(selectedCoupon.discount);
      couponDiscountAmount = (originalAmount * percentage) / 100;
    } else {
      // Fixed amount discount (remove '원' and convert to number)
      couponDiscountAmount = parseInt(selectedCoupon.discount.replace(/[^0-9]/g, '')) || 0;
    }
  }
  
  // Calculate points discount amount
  const pointsDiscountAmount = calculatePointsDiscount(selectedPoints);
  
  // Calculate final price
  const finalAmount = Math.max(0, originalAmount - couponDiscountAmount - pointsDiscountAmount);
  
  // Format all monetary values for display
  const originalPrice = formatKoreanWon(originalAmount);
  const couponDiscount = formatKoreanWon(couponDiscountAmount);
  const pointsDiscount = formatKoreanWon(pointsDiscountAmount);
  const finalPrice = formatKoreanWon(finalAmount);

  console.log(
    "Original Amount:", originalAmount,
    "Coupon Discount Amount:", couponDiscountAmount,
    "Points Discount Amount:", pointsDiscountAmount,
    "Final Amount:", finalAmount,
    "Formatted Values:",

    "d:", customerInfo.amount,
    { originalPrice, couponDiscount, pointsDiscount, finalPrice },

  )

  return (
    <div className="min-h-screen bg-white pb-24 ">
      <PageHeader title="" />

      <div className=" space-y-6 pt-4">
        <h1 className=" px-4 text-2xl font-bold">할인 및 결제 수단을 선택해 주세요.</h1>

        <div className="px-4 space-y-4">
          <h2 className="text-xl font-bold">쿠폰</h2>
          <div className="flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="border border-gray-300 rounded p-1">
                <Tag className="text-gray-500 h-5 w-5" />
              </div>
              {selectedCoupon ? (
                <div>
                  <p className="font-medium">{selectedCoupon.code}</p>
                  <p className="text-sm text-gray-500">{selectedCoupon.description}</p>
                </div>
              ) : (
                <span>미적용</span>
              )}
            </div>
            <CouponSelectionDialog
              selectedCoupon={selectedCoupon}
              onSelectCoupon={setSelectedCoupon}
            />
          </div>
          <p className="text-gray-500">
            사용 가능한 쿠폰이 있다면 적용해 보세요.
          </p>
        </div>

        <div className="w-full h-4 bg-gray-50">

        </div>
        <div className="px-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">포인트</h2>
            <div className="flex items-center gap-2">
              <Checkbox
                id="prioritizePointsHeader"
                checked={prioritizePoints}
                onCheckedChange={(checked) => setPrioritizePoints(checked as boolean)}
                className="data-[state=checked]:bg-primary-user data-[state=checked]:text-white"
              />
              <label htmlFor="prioritizePointsHeader" className="text-sm cursor-pointer">
                포인트 우선 사용하기
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary-user rounded p-1">
                <Wallet className="text-white w-5 h-5" />
              </div>
              {selectedPoints > 0 ? (
                <div>
                  <p className="font-medium">{selectedPoints.toLocaleString()}P</p>
                  <p className="text-sm text-gray-500">{selectedPoints.toLocaleString()}원 할인</p>
                </div>
              ) : (
                <span>미적용</span>
              )}
            </div>
            <PointsSelectionDialog
              selectedPoints={selectedPoints}
              onSelectPoints={setSelectedPoints}
              prioritizePoints={prioritizePoints}
              onPrioritizePointsChange={setPrioritizePoints}
            />
          </div>
          <p className="text-gray-500">
            {userData?.points && userData.points > 0
              ? `사용 가능한 포인트 ${userData.points.toLocaleString()}P가 있습니다.`
              : "사용 가능한 포인트가 없습니다"
            }
          </p>
        </div>
        <div className="w-full h-4 bg-gray-50">
        </div>

        {/* Business Status Check */}
        <div className="px-4 space-y-4">
          <h2 className="text-xl font-bold">사업자 여부</h2>
          <div className="flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="border border-gray-300 rounded p-1">
                <Building2 className="text-gray-500 h-5 w-5" />
              </div>
              <span>사업자 여부</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={isBusinessEntity}
                onCheckedChange={setIsBusinessEntity}
                className={isBusinessEntity ? "bg-primary-user" : ""}
              />
              <span>{isBusinessEntity ? "사업자" : "개인"}</span>
            </div>
          </div>
          {isBusinessEntity && (
            <div className="space-y-2">
              <p className="text-gray-500">
                사업자는 세금계산서 발행이 가능합니다.
              </p>
              <div className="pt-2">
                <label htmlFor="businessNumber" className="text-sm font-medium block mb-1">
                  등록하기
                </label>
                <Input
                  id="businessNumber"
                  placeholder="000-00-00000"
                  value={userData.business_registration_number || businessRegistrationNumber}
                  onChange={(e) => setBusinessRegistrationNumber(e.target.value)}
                  disabled={!!userData?.business_registration_number}
                  className={userData?.business_registration_number ? "bg-gray-100" : ""}
                />
                {userData?.business_registration_number && (
                  <p className="text-xs text-gray-500 mt-1">
                    등록된 사업자번호는 변경할 수 없습니다.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-4 bg-gray-50">

        </div>
        <div className="px-4 space-y-4">
          <h2 className="text-xl font-bold">결제수단</h2>
          <div className="flex items-center justify-between p-4 rounded-lg">
            <div className="flex items-center gap-3">
              {paymentMethod ? (
                <>
                  <div className="bg-gray-100 rounded p-1">
                    {paymentMethod.icon}
                  </div>
                  <div>
                    <p className="font-medium">{paymentMethod.name}</p>
                    <p className="text-sm text-gray-500">{paymentMethod.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-700 rounded p-1">
                    <span className="text-white text-xs">pay</span>
                  </div>
                  <span>결제수단 없음</span>
                </>
              )}
            </div>

            {/* <TossPaymentDialog/> */}

            
            <PaymentMethodDialog
              selectedPaymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
            />
          </div>
          {!paymentMethod && (
            <div className="flex items-center gap-2 text-rose-500">
              <AlertCircle className="w-5 h-5" />
              <span>결제수단을 등록해 주세요.</span>
            </div>
          )}
        </div>
        <div className="w-full h-4 bg-gray-50">

        </div>
        <div className="px-4 mt-8 pt-4 border-t">
          <button className="flex items-center justify-between w-full">
            <h2 className="text-xl font-bold">가사 청소</h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">기본금액(4시간)</span>
              <span>{originalPrice}</span>
            </div>
            {selectedCoupon && (
              <div className="flex justify-between text-cyan-500">
                <span>{selectedCoupon.description}</span>
                <span>-{couponDiscount}</span>
              </div>
            )}
            {selectedPoints > 0 && (
              <div className="flex justify-between text-cyan-500">
                <span>포인트 할인 ({selectedPoints.toLocaleString()}P)</span>
                <span>-{pointsDiscount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-3 border-t mt-2">
              <span>결제 예정금액</span>
              <span>{finalPrice}</span>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mt-4 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
            <p className="text-gray-600 text-sm">
              쿠폰과 포인트는 즉시 사용되며 서비스 비용은 1일 전 결제가 진행됩니다.
            </p>
          </div>

          <div className="mt-4 bg-gray-700 text-white p-3 rounded-lg text-center text-sm">
           서비스 완료 시 {125}포인트 지급!
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-white border-t z-10">
        {paymentMethod && (
          <p className=" relative font-medium inline-block bg-gray-700 text-white mb-3 p-3 rounded-lg text-xs">서비스 완료 시 {125}포인트 지급!
            <span className="absolute bottom-[-8px] left-4 w-0 h-0 
        border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-gray-700"></span></p>
        )}
        <Button
          onClick={onReservationComplete}
          className="w-full bg-primary-user hover:bg-primary-user/60 text-white py-6 text-base"
          disabled={!paymentMethod}
        >
          예약 완료하기
        </Button>
      </div>

    </div>
  );
};

export default ReservationConfirmation;
