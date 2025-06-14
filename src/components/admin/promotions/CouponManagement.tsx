
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CouponForm from "./CouponForm";
import CouponTable from "./CouponTable";
import DeleteCouponDialog from "./DeleteCouponDialog";
import { useCouponManagement } from "@/hooks/useCouponManagement";

const CouponManagement = () => {
  const {
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
    setDeleteDialogOpen
  } = useCouponManagement();

  return (
    <div className="space-y-4">
      <CouponTable 
        coupons={coupons}
        isLoading={isLoading}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? '쿠폰 수정' : '새 쿠폰 추가'}</DialogTitle>
          </DialogHeader>
          <CouponForm 
            coupon={selectedCoupon} 
            onComplete={() => {
              setFormOpen(false);
              fetchCoupons();
            }} 
          />
        </DialogContent>
      </Dialog>

      <DeleteCouponDialog
        coupon={selectedCoupon}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={deleteCoupon}
      />
    </div>
  );
};

export default CouponManagement;
