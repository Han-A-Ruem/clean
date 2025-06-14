import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trash2, ShoppingBag, MapPin, CreditCard, Plus, Check, X } from "lucide-react";
import { cartService, CartItem } from "@/services/cartService";
import { orderService } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { NotificationConfig } from "@/contexts/NotificationContext";
import { Address } from "@/types/reservation";
import { PaymentMethodData } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RadioGroup } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [tempSelectedAddressId, setTempSelectedAddressId] = useState<string | null>(null);
  const [tempSelectedPaymentMethodId, setTempSelectedPaymentMethodId] = useState<string | null>(null);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    fetchCartItems();
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    const items = await cartService.getCartItems();
    setCartItems(items);
    setLoading(false);
  };

  const fetchAddresses = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data as Address[]);

      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('billing_info')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data as PaymentMethodData[]);

      const defaultMethod = data.find(method => method.is_default);
      if (defaultMethod) {
        setSelectedPaymentMethodId(defaultMethod.id);
      } else if (data.length > 0) {
        setSelectedPaymentMethodId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    await cartService.removeFromCart(itemId);
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price.replace(',', '')), 0);
  };

  const handleAddressSelect = (addressId: string) => {
    setTempSelectedAddressId(addressId);
  };

  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setTempSelectedPaymentMethodId(paymentMethodId);
  };

  const confirmAddressSelection = () => {
    if (tempSelectedAddressId) {
      setSelectedAddressId(tempSelectedAddressId);
      setTempSelectedAddressId(null);
      setAddressSheetOpen(false);
      toast.success("배송지가 선택되었습니다");
    }
  };

  const confirmPaymentMethodSelection = () => {
    if (tempSelectedPaymentMethodId) {
      setSelectedPaymentMethodId(tempSelectedPaymentMethodId);
      setTempSelectedPaymentMethodId(null);
      setPaymentSheetOpen(false);
      toast.success("결제 수단이 선택되었습니다");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("배송지를 선택해주세요");
      return;
    }

    if (!selectedPaymentMethodId) {
      toast.error("결제 수단을 선택해주세요");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("장바구니가 비어있습니다");
      return;
    }

    setProcessingOrder(true);

    try {
      const orderId = await orderService.createOrder({
        address_id: selectedAddressId,
        payment_method_id: selectedPaymentMethodId,
        items: cartItems,
        total_amount: calculateTotal()
      });

      if (orderId) {
        await cartService.clearCart();
        toast.success("주문이 완료되었습니다");
        navigate('/shop/order-success');
      } else {
        toast.error("주문 처리 중 오류가 발생했습니다");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("주문 처리 중 오류가 발생했습니다");
    } finally {
      setProcessingOrder(false);
    }
  };

  const formatCardNumber = (cardNumber?: string) => {
    if (!cardNumber) return '';
    const last4 = cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const getPaymentMethodDescription = (method: PaymentMethodData) => {
    if (method.payment_type === 'credit_card') {
      return formatCardNumber(method.card_number);
    }
    if (method.payment_type === 'bank_account') {
      return `${method.bank_name} ${method.account_number ? '•••• •••• ' + method.account_number.slice(-4) : ''}`;
    }
    return method.name;
  };

  const handleAddPaymentMethod = () => {
    setPaymentModalOpen(true);
  };

  const renderAddressSheet = () => (
    <Sheet open={addressSheetOpen} onOpenChange={setAddressSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between mb-4">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {selectedAddressId
              ? addresses.find(a => a.id === selectedAddressId)?.address?.substring(0, 20) + '...'
              : "배송지 선택"}
          </div>
          <ChevronLeft className="h-4 w-4 rotate-270" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>배송지 선택</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">저장된 주소가 없습니다</p>
              <Button
                onClick={() => navigate('/more/address/add')}
                className="mt-4"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                새 주소 추가하기
              </Button>
            </div>
          ) : (
            <RadioGroup value={tempSelectedAddressId || selectedAddressId || ""} className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg cursor-pointer ${(tempSelectedAddressId || selectedAddressId) === address.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  onClick={() => handleAddressSelect(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{address.name || "기본 주소"}</h3>
                      <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                      {address.area && (
                        <div className="text-sm text-gray-500 mt-1">
                          면적: {address.area}평
                        </div>
                      )}
                    </div>
                    {(tempSelectedAddressId || selectedAddressId) === address.id && (
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          <Button
            onClick={() => navigate('/more/address/add')}
            variant="outline"
            className="w-full mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            새 주소 추가하기
          </Button>
        </div>

        <SheetFooter className="mt-6">
          <Button
            onClick={confirmAddressSelection}
            className="w-full bg-[#00C8B0] hover:bg-[#00B09F]"
            disabled={!tempSelectedAddressId}
          >
            확인
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const renderPaymentMethodSheet = () => (
    <Sheet open={paymentSheetOpen} onOpenChange={setPaymentSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            {selectedPaymentMethodId
              ? paymentMethods.find(p => p.id === selectedPaymentMethodId)?.name
              : "결제 수단 선택"}
          </div>
          <ChevronLeft className="h-4 w-4 rotate-270" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>결제 수단 선택</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">저장된 결제 수단이 없습니다</p>
              <Button
                onClick={handleAddPaymentMethod}
                className="mt-4"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                새 결제 수단 추가하기
              </Button>
            </div>
          ) : (
            <RadioGroup value={tempSelectedPaymentMethodId || selectedPaymentMethodId || ""} className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border rounded-lg cursor-pointer ${(tempSelectedPaymentMethodId || selectedPaymentMethodId) === method.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                    }`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{method.name}</h3>
                        {method.is_default && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            기본
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getPaymentMethodDescription(method)}
                      </p>
                    </div>
                    {(tempSelectedPaymentMethodId || selectedPaymentMethodId) === method.id && (
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          <Button
            onClick={handleAddPaymentMethod}
            variant="outline"
            className="w-full mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            새 결제 수단 추가하기
          </Button>
        </div>

        <SheetFooter className="mt-6">
          <Button
            onClick={confirmPaymentMethodSelection}
            className="w-full bg-[#00C8B0] hover:bg-[#00B09F]"
            disabled={!tempSelectedPaymentMethodId}
          >
            확인
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );

  const renderPaymentMethodModal = () => (
    <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen} >
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
        <div className="relative">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-12" />
              {/* <button 
                onClick={() => setPaymentModalOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button> */}
            </div>
          </div>
          
          <div className="flex">
            <div className="w-3/5 p-4 border-r">
              <div className="rounded-md border p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-8 w-20" />
                </div>
                
                <Skeleton className="h-[300px] w-full" />
              </div>
              
              <div className="mt-4">
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <div className="w-2/5 bg-gray-50 p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
                
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-28" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-center">
                  <Skeleton className="h-5 w-20 mx-auto mb-2" />
                  <Skeleton className="h-10 w-32 mx-auto" />
                </div>
              </div>
              
              <div className="mt-8">
                <Skeleton className="h-12 w-full rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <NotificationConfig position="top-center" offset="4rem">
      <div className="container max-w-lg mx-auto px-4 pb-24">
        <div className="sticky top-0 bg-white z-10 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/shop')} className="p-2 -ml-2">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold">장바구니</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <p>로딩 중...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">장바구니가 비어있습니다</h3>
              <p className="text-gray-500 mb-6">상품을 추가해보세요!</p>
              <Button
                variant="outline"
                onClick={() => navigate('/shop')}
                className="px-6"
              >
                쇼핑 계속하기
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border rounded-lg p-4 relative">
                    <div className="w-20 h-20 overflow-hidden rounded-md bg-gray-100 mr-4 flex items-center justify-center">
                      {item.img_url ? (
                        <img 
                          src={item.img_url} 
                          alt={item.title} 
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        item.image
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-2 text-right">
                        <span className="font-semibold">₩{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6">
                <h2 className="text-lg font-semibold">배송 및 결제</h2>
                {renderAddressSheet()}
                {renderPaymentMethodSheet()}
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h2 className="font-semibold">주문 요약</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품 금액</span>
                    <span>₩{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span>무료</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>총 결제 금액</span>
                    <span>₩{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {renderPaymentMethodModal()}

        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
            <Button
              className="w-full bg-[#00C8B0] hover:bg-[#00B09F] h-12"
              onClick={handleCheckout}
              disabled={processingOrder || !selectedAddressId || !selectedPaymentMethodId}
            >
              {processingOrder ? "처리 중..." : `₩${calculateTotal().toLocaleString()} 결제하기`}
            </Button>
          </div>
        )}
      </div>
    </NotificationConfig>
  );
}

export default Cart;
