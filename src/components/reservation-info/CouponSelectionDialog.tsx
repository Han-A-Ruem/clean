
import React from "react";
import { Tag, Check, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCoupons } from "@/hooks/useCoupons";

export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
  expiryDate: string;
}

interface CouponSelectionDialogProps {
  selectedCoupon: Coupon | null;
  onSelectCoupon: (coupon: Coupon | null) => void;
}

const CouponSelectionDialog: React.FC<CouponSelectionDialogProps> = ({
  selectedCoupon,
  onSelectCoupon,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { userCoupons, isLoading } = useCoupons();

  // Convert user coupons to the format expected by the component
  const availableCoupons: Coupon[] = userCoupons
    .filter(uc => !uc.is_used)
    .map(uc => ({
      id: uc.id,
      code: uc.coupon.code,
      discount: uc.coupon.discount_type === 'percentage' ? 
        `${uc.coupon.discount_value}%` : 
        `${uc.coupon.discount_value.toLocaleString()}원`,
      description: uc.coupon.description,
      expiryDate: uc.coupon.expiry_date ? new Date(uc.coupon.expiry_date).toLocaleDateString() : '',
    }));

  const filteredCoupons = availableCoupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCoupon = (coupon: Coupon) => {
    onSelectCoupon(coupon);
    setOpen(false);
  };

  const handleRemoveCoupon = () => {
    onSelectCoupon(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary-user bg-transparent hover:bg-gray-50">
          {selectedCoupon ? "변경" : "추가"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            쿠폰 선택
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="쿠폰 검색하기"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">쿠폰을 불러오는 중...</p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <div 
                    key={coupon.id}
                    className={`p-3 border rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 
                      ${selectedCoupon?.id === coupon.id ? 'border-cyan-500 bg-cyan-50' : ''}`}
                    onClick={() => handleSelectCoupon(coupon)}
                  >
                    <div>
                      <p className="font-medium">{coupon.code}</p>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                      {coupon.expiryDate && <p className="text-xs text-gray-400">만료일: {coupon.expiryDate}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-500 font-bold">{coupon.discount}</span>
                      {selectedCoupon?.id === coupon.id && <Check className="h-5 w-5 text-cyan-500" />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "검색 결과가 없습니다" : "등록된 쿠폰이 없습니다."}
                </div>
              )}
            </div>
          )}
          
          {selectedCoupon && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleRemoveCoupon}
              >
                <X className="h-4 w-4 mr-2" />
                쿠폰 제거
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CouponSelectionDialog;
