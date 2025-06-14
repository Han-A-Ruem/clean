
import { supabase } from "@/integrations/supabase/client";
import { ShopItemType, getIconComponent } from "@/services/shopItemService";
import { toast } from "sonner";

// export interface CartItem {
//   id: string;
//   item_id: string;
//   title: string;
//   description: string;
//   price: string;
//   category: string;
//   badge?: string;
//   image?: React.ReactNode;
// }
export type CartItem = ShopItemType;
export const cartService = {
  async getCartItems(): Promise<ShopItemType[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("shopping_cart")
        .select("*, shop_items(icon_name , img_url)")
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error fetching cart items:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        item_id: item.item_id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        badge: item.badge,
        // Convert icon_name to component
        image: item.shop_items ? getIconComponent(item.shop_items.icon_name) : null,
        img_url: item.shop_items.img_url
      }));
    } catch (error) {
      console.error("Error in getCartItems:", error);
      return [];
    }
  },
  
  async addToCart(item: ShopItemType): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("로그인 후 이용해주세요.");
        return false;
      }
      
      const { data, error } = await supabase
        .from("shopping_cart")
        .insert({
          user_id: user.id,
          item_id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          badge: item.badge || null
        })
        .select();
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          toast.error("이미 장바구니에 있는 상품입니다");
        } else {
          console.error("Error adding item to cart:", error);
          toast.error("장바구니에 상품을 추가하는 중 오류가 발생했습니다");
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in addToCart:", error);
      return false;
    }
  },
  
  async removeFromCart(item_id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      const { error } = await supabase
        .from("shopping_cart")
        .delete()
        .eq("item_id", item_id)
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error removing item from cart:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      return false;
    }
  },
  
  async isItemInCart(item_id: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      const { data, error } = await supabase
        .from("shopping_cart")
        .select("id")
        .eq("item_id", item_id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking if item is in cart:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error in isItemInCart:", error);
      return false;
    }
  },
  
  async getCartCount(): Promise<number> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return 0;
      }
      
      const { count, error } = await supabase
        .from("shopping_cart")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error getting cart count:", error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error("Error in getCartCount:", error);
      return 0;
    }
  },
  
  async clearCart(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return false;
      }
      
      const { error } = await supabase
        .from("shopping_cart")
        .delete()
        .eq("user_id", user.id);
      
      if (error) {
        console.error("Error clearing cart:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in clearCart:", error);
      return false;
    }
  }
};

// Helper function to convert string item ID back to the corresponding component
function getImageComponentFromId(itemId: string) {
  try {
    // Fetch icon_name from shop_items table
    const fetchIconName = async () => {
      const { data, error } = await supabase
        .from("shop_items")
        .select("icon_name")
        .eq("id", itemId)
        .maybeSingle();
        
      if (error || !data) {
        console.error("Error fetching icon name:", error);
        return null;
      }
      
      return getIconComponent(data.icon_name);
    };
    
    return fetchIconName();
  } catch (error) {
    console.error("Error in getImageComponentFromId:", error);
    return null;
  }
}
