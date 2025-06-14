
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "./cartService";
import { toast } from "sonner";

export interface Order {
  id: string;
  user_id: string;
  address_id: string | null;
  payment_method_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}

export const orderService = {
  async createOrder(data: {
    address_id: string;
    payment_method_id: string;
    items: CartItem[];
    total_amount: number;
  }): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("로그인이 필요합니다");
        return null;
      }
      
      // Create the order - store items as stringified JSON
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          address_id: data.address_id,
          payment_method_id: data.payment_method_id,
          total_amount: data.total_amount,
          items: JSON.stringify(data.items) // Convert items to string to fix type issue
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating order:", error);
        toast.error("주문 생성 중 오류가 발생했습니다");
        return null;
      }
      
      // Create order items
      for (const item of data.items) {
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            item_id: item.id,
            title: item.title,
            price: item.price
          });
        
        if (itemError) {
          console.error("Error adding order item:", itemError);
        }
      }
      
      return order.id;
    } catch (error) {
      console.error("Error in createOrder:", error);
      return null;
    }
  },
  
  async getOrders(): Promise<Order[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }
      
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
        return [];
      }
      
      // Parse the items JSON string back to an array
      return data.map(order => ({
        ...order,
        items: JSON.parse(order.items as string) as CartItem[]
      }));
    } catch (error) {
      console.error("Error in getOrders:", error);
      return [];
    }
  },
  
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching order:", error);
        return null;
      }
      
      if (!data) return null;
      
      // Parse the items JSON string back to an array
      return {
        ...data,
        items: JSON.parse(data.items as string) as CartItem[]
      };
    } catch (error) {
      console.error("Error in getOrderById:", error);
      return null;
    }
  }
};
