
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Notice {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  is_unread?: boolean;
  user_id?: string;
}

export function useNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNotices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setNotices(data || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      // If there's an error or no data, use a default notice
      setNotices([
        {
          id: "default",
          title: "친구 초대",
          subtitle: "깨이 발생한 기분이 두배!",
          date: "5,000크레딧 지급",
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const createNotice = async (notice: Omit<Notice, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert([notice])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setNotices(prevNotices => [data[0], ...prevNotices]);
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create notice'));
      throw err;
    }
  };

  const updateNotice = async (id: string, updates: Partial<Notice>) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice.id === id ? { ...notice, ...updates } : notice
        )
      );
      return data[0];
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update notice'));
      throw err;
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setNotices(prevNotices => prevNotices.filter(notice => notice.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete notice'));
      throw err;
    }
  };

  const markAsRead = async (noticeId: string, userId?: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('notices')
        .update({ is_unread: false })
        .eq('id', noticeId)
        .eq('user_id', userId);

      if (error) {
        throw new Error(error.message);
      }

      // Update local state
      setNotices(prevNotices => 
        prevNotices.map(notice => 
          notice.id === noticeId ? { ...notice, is_unread: false } : notice
        )
      );
    } catch (err) {
      console.error('Error marking notice as read:', err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return {
    notices,
    isLoading,
    error,
    fetchNotices,
    markAsRead,
    createNotice,
    updateNotice,
    deleteNotice
  };
}
