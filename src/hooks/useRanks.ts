
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Rank {
  id: string;
  name: string;
  label: string;
  hourly_wage: number;
  color: string;
  bg_color: string;
  icon_size: number;
  order_index: number;
  is_active: boolean;
}

export const useRanks = () => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('ranks')
          .select('*')
          .eq('is_active', true)
          .order('hourly_wage', { ascending: true });
        
        if (error) throw error;
        
        setRanks(data || []);
      } catch (err) {
        console.error('Error fetching ranks:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanks();
  }, []);

  return { ranks, isLoading, error };
};
