
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export interface ShopItemProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

const ShopItem: React.FC<ShopItemProps> = ({
  title,
  description,
  price,
  image,
  badge,
  onClick,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 pb-2">
        <div className="flex justify-center items-center bg-gray-50 rounded-lg h-32 mb-4">
          {image}
        </div>
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-medium text-lg">{title}</h3>
          {badge && (
            <span className="text-xs bg-[#00C8B0] text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm mb-3 h-10 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{price}</span>
          <Button
            onClick={onClick}
            size="sm"
            className="bg-[#00C8B0] hover:bg-[#00B09F] text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            담기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopItem;
