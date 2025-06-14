
import { UserWithReservations } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface UserAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithReservations | null;
}

const UserAddressDialog = ({ open, onOpenChange, user }: UserAddressDialogProps) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  
  // Track if we've already shown the toast for this dialog session
  const [hasShownToast, setHasShownToast] = useState(false);

  // Reset the copied state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsCopied(false);
      setHasShownToast(false);
    }
  }, [open]);

  // Show toast notification when address is viewed - only once per dialog open
  useEffect(() => {
    if (open && user?.address && !hasShownToast) {
      toast({
        title: "주소 정보",
        description: `${user.name || "고객"}님의 주소 정보를 보고 있습니다.`,
      });
      setHasShownToast(true);
    }
  }, [open, user, toast, hasShownToast]);

  const copyToClipboard = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      setIsCopied(true);
      
      toast({
        title: "주소 복사 완료",
        description: "클립보드에 주소가 복사되었습니다.",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>고객 주소 정보</DialogTitle>
          <DialogDescription>
            {user?.name || "고객"}님의 주소 정보입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start space-y-2 pt-4">
          <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium">{user?.name || "고객"}님 주소</h3>
            <p className="text-gray-700 mt-1">
              {user?.address || "주소 정보가 없습니다."}
            </p>
            {user?.address && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="mt-3 flex items-center gap-1"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                주소 복사하기
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddressDialog;
