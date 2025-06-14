
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Check, ShoppingBag } from "lucide-react";
import { ShopItemType, shopItemService } from "@/services/shopItemService";
import { cartService } from "@/services/cartService";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "../Utils";
import { Skeleton } from "@/components/ui/skeleton";

const ShopItemDetails: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("id");
  const [item, setItem] = useState<ShopItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!itemId) {
        toast.error("상품 ID가 없습니다");
        navigate("/shop");
        return;
      }

      setLoading(true);
      try {
        const itemDetails = await shopItemService.getShopItemById(itemId);
        if (!itemDetails) {
          toast.error("상품을 찾을 수 없습니다");
          navigate("/shop");
          return;
        }
        setItem(itemDetails);

        // Check if item is in cart
        if (user) {
          const cartItems = await cartService.getCartItems();
          setIsInCart(cartItems.some(cartItem => cartItem.id === itemId));
          setCartCount(cartItems.length);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        toast.error("상품 정보를 불러오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId, navigate, user]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    if (!item) return;

    const success = await cartService.addToCart(item);
    if (success) {
      setIsInCart(true);
      setCartCount(prev => prev + 1);
      toast.success(`${item.title}이(가) 장바구니에 추가되었습니다.`);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!user || !itemId) return;

    const success = await cartService.removeFromCart(itemId);
    if (success) {
      setIsInCart(false);
      setCartCount(prev => prev - 1);
      toast.success("상품이 장바구니에서 제거되었습니다.");
    }
  };

  const handleGoBack = () => {
    navigate("/shop");
  };

  const goToCart = () => {
    navigate("/shop/cart");
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader title="상품 상세" rightElement={    <div className="relative cursor-pointer" onClick={goToCart}>
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full bg-[#00C8B0]">
                {cartCount}
              </Badge>
            )}
          </div>}/>
        <div className="px-4 flex justify-center items-center py-12">
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className=" mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-0 mr-2"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">상품 상세</h1>
          </div>
          <div className="relative cursor-pointer" onClick={goToCart}>
            <ShoppingBag className="w-6 h-6 text-gray-700" />
            {cartCount > 0 && (
              <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full bg-[#00C8B0]">
                {cartCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">상품 정보를 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="  mx-auto max-w-4xl">
   
<PageHeader title="상품 상세" rightElement={<div className="relative cursor-pointer" onClick={goToCart}>
          <ShoppingBag className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full bg-[#00C8B0]">
              {cartCount}
            </Badge>
          )}
        </div>}/>
      <Card className="overflow-hidden mb-6 mt-2 mx-2">
        <CardContent className="p-4">
          <div className="flex justify-center items-center bg-gray-50 rounded-lg mb-4">
            <AspectRatio ratio={1} className="w-full max-w-md">
              <div className="flex items-center justify-center h-full relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                )}
                {item.img_url ? (
                  <img 
                    src={item.img_url} 
                    alt={item.title} 
                    className={cn(
                      "object-contain max-h-full max-w-full",
                      imageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200"
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageLoad}
                  />
                ) : (
                  <div className={cn(
                    imageLoading ? "opacity-0" : "opacity-100 transition-opacity duration-200"
                  )}>
                    {item.image}
                  </div>
                )}
              </div>
            </AspectRatio>
          </div>

          <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-semibold">{item.title}</h2>
            {item.badge && (
              <span className="text-xs bg-[#00C8B0] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                {item.badge}
              </span>
            )}
          </div>

          <div className="font-bold text-xl mb-3">{item.price}</div>
          
          <div className="border-t pt-3 mb-4">
            <h3 className="font-medium mb-2">상품 설명</h3>
            <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
          </div>

          <div className="border-t pt-3">
            <h3 className="font-medium mb-2">카테고리</h3>
            <p className="text-gray-700">{item.category}</p>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0  left-0 right-0 p-4 bg-white border-t shadow-md flex gap-3">
        <Button
          onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
          className={cn(
            "flex-1",
            isInCart 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-[#00C8B0] hover:bg-[#00B09F] text-white"
          )}
        >
          {isInCart ? (
            <>
              <Check className="w-5 h-5 mr-1" />
              <span>장바구니에서 제거</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 mr-1" />
              <span>장바구니에 담기</span>
            </>
          )}
        </Button>
        
       
      </div>
    </div>
  );
};

export default ShopItemDetails;
