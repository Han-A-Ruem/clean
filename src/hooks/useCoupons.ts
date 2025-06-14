
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { UserCoupon, Coupon } from '@/types/coupon';

export const useCoupons = () => {
  const { userData } = useUser();
  const [userCoupons, setUserCoupons] = useState<(UserCoupon & { coupon: Coupon })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUserCoupons = async () => {
    if (!userData?.user_id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_coupons')
        .select(`
          id,
          user_id,
          coupon_id,
          is_used,
          used_at,
          created_at,
          coupon:coupons(*)
        `)
        .eq('user_id', userData.user_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setUserCoupons(data as any);
    } catch (err: any) {
      console.error('Error fetching coupons:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "쿠폰을 불러오는 중 오류가 발생했습니다",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCouponByCode = async (couponCode: string) => {
    if (!userData?.user_id) return;
    
    try {
      // First check if coupon exists
      const { data: couponData, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .eq('is_active', true)
        .single();

      if (couponError) {
        if (couponError.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "유효하지 않은 쿠폰",
            description: "입력하신 쿠폰코드가 존재하지 않습니다.",
          });
        } else {
          throw couponError;
        }
        return;
      }

      // Check if the coupon has expired
      if (couponData.expiry_date && new Date(couponData.expiry_date) < new Date()) {
        toast({
          variant: "destructive",
          title: "만료된 쿠폰",
          description: "이 쿠폰은 이미 만료되었습니다.",
        });
        return;
      }

      // Check if user already has this coupon
      const { data: existingCoupon, error: existingError } = await supabase
        .from('user_coupons')
        .select('*')
        .eq('user_id', userData.user_id)
        .eq('coupon_id', couponData.id)
        .maybeSingle();

      if (existingCoupon) {
        toast({
          variant: "destructive",
          title: "이미 등록된 쿠폰",
          description: "이 쿠폰은 이미 등록되어 있습니다.",
        });
        return;
      }

      // Add coupon to user
      const { error: insertError } = await supabase
        .from('user_coupons')
        .insert({
          user_id: userData.user_id,
          coupon_id: couponData.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "쿠폰이 등록되었습니다",
        description: `${couponData.description} 쿠폰이 정상적으로 등록되었습니다.`,
      });

      // Refresh coupons list
      fetchUserCoupons();
    } catch (err: any) {
      console.error('Error adding coupon:', err);
      toast({
        variant: "destructive",
        title: "쿠폰 등록 중 오류가 발생했습니다",
        description: err.message,
      });
    }
  };

  // Fetch coupons when user data is available
  useEffect(() => {
    if (userData?.user_id) {
      fetchUserCoupons();
    }
  }, [userData?.user_id]);

  return {
    userCoupons,
    isLoading,
    error,
    fetchUserCoupons,
    addCouponByCode,
  };
};
