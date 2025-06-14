import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CategorySelector from "@/components/shop/CategorySelector";
import { ShoppingBag, ShoppingCart, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ShopCard from "@/components/shop/ShopCard";
import { cartService } from "@/services/cartService";
import { useUser } from "@/contexts/UserContext";
import { ShopItemType, shopItemService } from "@/services/shopItemService";
import { Input } from "@/components/ui/input";

const Shop: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [itemsInCart, setItemsInCart] = useState<Set<string>>(new Set());
  const [shopItems, setShopItems] = useState<ShopItemType[]>([]);
  const [categories, setCategories] = useState<string[]>(["전체"]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    // Load initial data
    loadShopData();
    // Load cart data on component mount
    if (user) {
      loadCartData();
    }
  }, [user]);

  const loadShopData = async () => {
    setLoading(true);
    try {
      // Fetch shop items
      const items = await shopItemService.getShopItems();
      setShopItems(items);

      // Fetch categories
      const categories = await shopItemService.getShopCategories();
      setCategories(categories);
    } catch (error) {
      console.error("Error loading shop data:", error);
      toast.error("상품 정보를 불러오는 중 오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  const loadCartData = async () => {
    try {
      const items = await cartService.getCartItems();
      setCartCount(items.length);

     
      setItemsInCart(new Set(items.map(item => item.id)));
      console.log('items', itemsInCart)
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  const handleAddToCart = async (item: ShopItemType) => {
    if (!user) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    const success = await cartService.addToCart(item);
    if (success) {
      setCartCount(prev => prev + 1);
      setItemsInCart(prev => new Set([...prev, item.id]));
      toast.success(`${item.title}이(가) 장바구니에 추가되었습니다.`);
    }
  };

  const handleRemoveFromCart = async (itemId: string) => {
    if (!user) return;

    const success = await cartService.removeFromCart(itemId);
    if (success) {
      setCartCount(prev => prev - 1);
      setItemsInCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      toast.success("상품이 장바구니에서 제거되었습니다.");
    }
  };

  const isItemInCart = (itemId: string) => {
    return itemsInCart.has(itemId);
  };

  // Filter items by category and search term
  const filteredItems = shopItems
    .filter(item => {
      // Category filter
      if (activeCategory !== "전체" && item.category !== activeCategory) {
        return false;
      }
      
      // Search term filter (if there is a search term)
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) || 
          (item.description && item.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });

  return (
    <div className="container px-4 py-6 mx-auto max-w-4xl">
      {/* Header with title and cart icon */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">플러스샵</h1>
        <div className="relative cursor-pointer" onClick={() => navigate('/shop/cart')}>
          <ShoppingBag className="w-6 h-6 text-gray-700" />
          {cartCount > 0 && (
            <Badge variant="default" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center rounded-full bg-[#00C8B0]">
              {cartCount}
            </Badge>
          )}
        </div>
      </div>


      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="상품 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
      {/* Category selector */}
      <div className="mb-6">
        <CategorySelector
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>



      {/* Shop items grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p>상품을 불러오는 중...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">상품이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              isInCart={isItemInCart(item.id)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          ))}
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 right-4 z-10">
          <div 
            className="flex items-center justify-center bg-[#00C8B0] text-white p-3 rounded-full shadow-lg cursor-pointer"
            onClick={() => navigate('/shop/cart')}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="sr-only">장바구니로 이동</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
