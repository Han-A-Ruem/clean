import { supabase } from "@/integrations/supabase/client";
import { icons } from "lucide-react";
import React from "react";

export interface ShopItemType {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  badge?: string;
  image: React.ReactNode;
  icon_name?: string;
  img_url?: string;
  is_active?: boolean;
}

export const getIconComponent = (iconName: string) => {
  const LucideIcon = icons[iconName as keyof typeof icons];
  return LucideIcon ? React.createElement(LucideIcon, { className: "w-12 h-12 text-[#00C8B0]", strokeWidth: 1.5 }) : null;
};

export const shopItemService = {
  async getShopItems(): Promise<ShopItemType[]> {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .eq("is_active", true)
        .order("created_at");
      
      if (error) {
        console.error("Error fetching shop items:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        badge: item.badge || undefined,
        icon_name: item.icon_name,
        img_url: item.img_url,
        is_active: item.is_active,
        image: item.img_url ? null : getIconComponent(item.icon_name)
      }));
    } catch (error) {
      console.error("Error in getShopItems:", error);
      return [];
    }
  },
  
  async getAllShopItems(): Promise<ShopItemType[]> {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .order("created_at");
      
      if (error) {
        console.error("Error fetching all shop items:", error);
        return [];
      }
      
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        badge: item.badge || undefined,
        icon_name: item.icon_name,
        img_url: item.img_url,
        is_active: item.is_active,
        image: item.img_url ? null : getIconComponent(item.icon_name)
      }));
    } catch (error) {
      console.error("Error in getAllShopItems:", error);
      return [];
    }
  },
  
  async getShopCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("category");
      
      if (error) {
        console.error("Error fetching shop categories:", error);
        return ["전체"];
      }
      
      const categories = new Set<string>(data.map(item => item.category));
      return ["전체", ...Array.from(categories)];
    } catch (error) {
      console.error("Error in getShopCategories:", error);
      return ["전체"];
    }
  },

  async getShopItemById(id: string): Promise<ShopItemType | null> {
    try {
      const { data, error } = await supabase
        .from("shop_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error || !data) {
        console.error("Error fetching shop item:", error);
        return null;
      }
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        badge: data.badge || undefined,
        icon_name: data.icon_name,
        img_url: data.img_url,
        is_active: data.is_active,
        image: data.img_url ? null : getIconComponent(data.icon_name)
      };
    } catch (error) {
      console.error("Error in getShopItemById:", error);
      return null;
    }
  },

  async createShopItem(item: Omit<ShopItemType, 'id' | 'image'>): Promise<string | null> {
    try {
      const newId = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from("shop_items")
        .insert({
          id: newId,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          badge: item.badge,
          icon_name: item.icon_name,
          img_url: item.img_url,
          is_active: item.is_active !== undefined ? item.is_active : true
        })
        .select("id")
        .single();
      
      if (error) {
        console.error("Error creating shop item:", error);
        return null;
      }
      
      return data.id;
    } catch (error) {
      console.error("Error in createShopItem:", error);
      return null;
    }
  },

  async updateShopItem(id: string, item: Partial<Omit<ShopItemType, 'id' | 'image'>>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shop_items")
        .update({
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          badge: item.badge,
          icon_name: item.icon_name,
          img_url: item.img_url,
          is_active: item.is_active
        })
        .eq("id", id);
      
      if (error) {
        console.error("Error updating shop item:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in updateShopItem:", error);
      return false;
    }
  },

  async deleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shop_items")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error deleting shop item:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteShopItem:", error);
      return false;
    }
  },

  async softDeleteShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shop_items")
        .update({ is_active: false })
        .eq("id", id);
      
      if (error) {
        console.error("Error soft deleting shop item:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in softDeleteShopItem:", error);
      return false;
    }
  },

  async activateShopItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("shop_items")
        .update({ is_active: true })
        .eq("id", id);
      
      if (error) {
        console.error("Error activating shop item:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in activateShopItem:", error);
      return false;
    }
  },

  async uploadImage(file: File): Promise<string | null> {
    try {
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("이미지 크기는 2MB 이하여야 합니다");
      }
      
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('shop_items')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('shop_items')
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error in uploadImage:", error);
      return null;
    }
  },
  
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const bucketName = 'shop_items';
      const urlObj = new URL(imageUrl);
      const pathSegments = urlObj.pathname.split('/');
      const filePath = pathSegments.slice(pathSegments.indexOf(bucketName) + 1).join('/');
      
      if (!filePath) {
        console.error("Could not extract file path from URL:", imageUrl);
        return false;
      }
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) {
        console.error("Error deleting image:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteImage:", error);
      return false;
    }
  }
};
