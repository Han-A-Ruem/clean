
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Coupon } from "@/types/coupon";

export const useCouponManagement = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fix the type issue by explicitly mapping each coupon and casting the discount_type
      setCoupons((data || []).map(coupon => ({
        ...coupon,
        discount_type: coupon.discount_type as "fixed" | "percentage"
      })));
    } catch (error: any) {
      console.error('Error fetching coupons:', error);
      toast.error('쿠폰 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedCoupon(null);
    setIsEditing(false);
    setFormOpen(true);
  };

  const handleEditClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setIsEditing(true);
    setFormOpen(true);
  };

  const handleDeleteClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDeleteDialogOpen(true);
  };

  const deleteCoupon = async () => {
    if (!selectedCoupon) return;
    
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', selectedCoupon.id);

      if (error) throw error;
      
      toast.success('쿠폰이 삭제되었습니다.');
      fetchCoupons();
    } catch (error: any) {
      console.error('Error deleting coupon:', error);
      toast.error('쿠폰 삭제 중 오류가 발생했습니다.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCoupon(null);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return {
    coupons,
    isLoading,
    selectedCoupon,
    formOpen,
    deleteDialogOpen,
    isEditing,
    fetchCoupons,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    deleteCoupon,
    setFormOpen,
    setDeleteDialogOpen,
    setSelectedCoupon
  };
};
