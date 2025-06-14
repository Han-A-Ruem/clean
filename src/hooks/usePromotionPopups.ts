
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PromotionPopup } from "@/types/promotion";

export const usePromotionPopups = () => {
  const [activePopup, setActivePopup] = useState<PromotionPopup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchActivePromotionPopup = async () => {
      try {
        setIsLoading(true);
        
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('promotion_popups')
          .select('*')
          .eq('is_active', true)
          .lte('start_date', now)
          .or(`end_date.is.null,end_date.gt.${now}`)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (error) throw error;
        
        setActivePopup(data && data.length > 0 ? data[0] : null);
      } catch (err) {
        console.error('Error fetching active promotion popup:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePromotionPopup();
  }, []);

  return { activePopup, isLoading, error };
};
