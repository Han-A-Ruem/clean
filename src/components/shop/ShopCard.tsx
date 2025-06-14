
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ShoppingCart, Check } from "lucide-react";
import { ShopItemType } from "@/data/shopData";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ShopCardProps {
  item: ShopItemType;
  isInCart: boolean;
  onAddToCart: (item: ShopItemType) => void;
  onRemoveFromCart: (itemId: string) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  item,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
}) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = React.useState(true);

  const handleCardClick = () => {
    navigate(`/shop/item/detail?id=${item.id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    isInCart ? onRemoveFromCart(item.id) : onAddToCart(item);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardContent className="p-4 pb-2 flex-grow">
        <div className="flex justify-center items-center bg-gray-50 rounded-lg mb-4">
          <AspectRatio ratio={1} className="w-full">
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
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-lg truncate max-w-[80%]">{item.title}</h3>
          {item.badge && (
            <span className="text-xs bg-[#00C8B0] text-white px-2 py-0.5 rounded-full whitespace-nowrap">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-3 h-10 line-clamp-2 overflow-hidden">{item.description}</p>
        <div className="font-bold text-lg">{item.price}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          onClick={handleButtonClick}
          size="sm"
          className={cn(
            "w-full",
            isInCart 
            ? "bg-green-500 hover:bg-green-600 text-white" 
            : "bg-[#00C8B0] hover:bg-[#00B09F] text-white"
          )}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              <span className="truncate">장바구니에 있음</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-1" />
              <span className="truncate">담기</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ShopCard;
