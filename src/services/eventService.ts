
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface Event {
  id: string;
  title: string;
  description: string;
  image_url: string;
  date_range: string;
  is_active: boolean;
  badge?: string;
  target_audience?: 'all' | 'cleaner' | 'customer';
}

export const eventService = {
  async getEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching events:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getEvents:", error);
      return [];
    }
  },
  
  async getActiveEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching active events:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getActiveEvents:", error);
      return [];
    }
  },
  
  async getInactiveEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .select("*")
        .eq("is_active", false)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching inactive events:", error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error("Error in getInactiveEvents:", error);
      return [];
    }
  },
  
  async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Error fetching event by ID:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in getEventById:", error);
      return null;
    }
  },
  
  async uploadEventImage(file: File): Promise<string | null> {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('event_images')
        .upload(filePath, file);
      
      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('event_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error("Error in uploadEventImage:", error);
      return null;
    }
  },
  
  async createEvent(event: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .insert({
          ...event,
          date_range: event.date_range || "",
          description: event.description || "",
          image_url: event.image_url || "",
          title: event.title || "",
          target_audience: event.target_audience || "all"
        })
        .select("*")
        .single();
      
      if (error) {
        console.error("Error creating event:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in createEvent:", error);
      return null;
    }
  },
  
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from("event_items")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();
      
      if (error) {
        console.error("Error updating event:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Error in updateEvent:", error);
      return null;
    }
  },
  
  async deleteEvent(id: string): Promise<boolean> {
    try {
      // Hard delete the event
      const { error } = await supabase
        .from("event_items")
        .delete()
        .eq("id", id);
      
      if (error) {
        console.error("Error deleting event:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      return false;
    }
  }
};
