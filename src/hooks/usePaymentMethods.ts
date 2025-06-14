
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PaymentMethodData, PaymentMethodFormData } from '@/types/billing';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { userData } = useUser();

  const fetchPaymentMethods = async () => {
    if (!userData?.user_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('billing_info')
        .select('*')
        .eq('user_id', userData.user_id)
        .order('is_default', { ascending: false });
      
      if (error) throw error;
      
      setPaymentMethods(data || []);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast({
        variant: 'destructive',
        title: '결제 수단을 불러오는 중 오류가 발생했습니다',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (data: PaymentMethodFormData) => {
    if (!userData?.user_id) return;
    
    try {
      // If this is the first payment method or explicitly set as default
      const shouldBeDefault = data.is_default || paymentMethods.length === 0;
      
      // If setting as default, unset any existing default
      if (shouldBeDefault && paymentMethods.length > 0) {
        await supabase
          .from('billing_info')
          .update({ is_default: false })
          .eq('user_id', userData.user_id)
          .eq('is_default', true);
      }
      
      const { error } = await supabase
        .from('billing_info')
        .insert({
          ...data,
          user_id: userData.user_id,
          is_default: shouldBeDefault,
        });
      
      if (error) throw error;
      
      toast({
        title: '결제 수단이 추가되었습니다',
        description: '성공적으로 결제 수단이 추가되었습니다.',
      });
      
      await fetchPaymentMethods();
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast({
        variant: 'destructive',
        title: '결제 수단 추가 중 오류가 발생했습니다',
        description: error.message,
      });
    }
  };

  const updatePaymentMethod = async (id: string, data: PaymentMethodFormData) => {
    if (!userData?.user_id) return;
    
    try {
      // If setting as default, unset any existing default
      if (data.is_default) {
        await supabase
          .from('billing_info')
          .update({ is_default: false })
          .eq('user_id', userData.user_id)
          .eq('is_default', true);
      }
      
      const { error } = await supabase
        .from('billing_info')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', userData.user_id);
      
      if (error) throw error;
      
      toast({
        title: '결제 수단이 업데이트되었습니다',
        description: '성공적으로 결제 수단이 업데이트되었습니다.',
      });
      
      await fetchPaymentMethods();
    } catch (error: any) {
      console.error('Error updating payment method:', error);
      toast({
        variant: 'destructive',
        title: '결제 수단 업데이트 중 오류가 발생했습니다',
        description: error.message,
      });
    }
  };

  const deletePaymentMethod = async (id: string) => {
    if (!userData?.user_id) return;
    
    try {
      // Check if this is the default payment method
      const methodToDelete = paymentMethods.find(method => method.id === id);
      
      const { error } = await supabase
        .from('billing_info')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user_id);
      
      if (error) throw error;
      
      // If we deleted the default and have other methods, make another one default
      if (methodToDelete?.is_default && paymentMethods.length > 1) {
        const nextMethod = paymentMethods.find(method => method.id !== id);
        if (nextMethod) {
          await supabase
            .from('billing_info')
            .update({ is_default: true })
            .eq('id', nextMethod.id)
            .eq('user_id', userData.user_id);
        }
      }
      
      toast({
        title: '결제 수단이 삭제되었습니다',
        description: '성공적으로 결제 수단이 삭제되었습니다.',
      });
      
      await fetchPaymentMethods();
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      toast({
        variant: 'destructive',
        title: '결제 수단 삭제 중 오류가 발생했습니다',
        description: error.message,
      });
    }
  };

  const setDefaultPaymentMethod = async (id: string) => {
    if (!userData?.user_id) return;
    
    try {
      // Unset any existing default
      await supabase
        .from('billing_info')
        .update({ is_default: false })
        .eq('user_id', userData.user_id)
        .eq('is_default', true);
      
      // Set the new default
      const { error } = await supabase
        .from('billing_info')
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user_id);
      
      if (error) throw error;
      
      toast({
        title: '기본 결제 수단이 변경되었습니다',
        description: '성공적으로 기본 결제 수단이 변경되었습니다.',
      });
      
      await fetchPaymentMethods();
    } catch (error: any) {
      console.error('Error setting default payment method:', error);
      toast({
        variant: 'destructive',
        title: '기본 결제 수단 설정 중 오류가 발생했습니다',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (userData?.user_id) {
      fetchPaymentMethods();
    }
  }, [userData?.user_id]);

  return {
    paymentMethods,
    isLoading,
    fetchPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};
