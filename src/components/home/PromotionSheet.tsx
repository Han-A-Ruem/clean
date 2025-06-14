
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePromotionPopups } from "@/hooks/usePromotionPopups";
import { useUser } from "@/contexts/UserContext";
import { usePromotion } from "@/contexts/PromotionContext";

interface PromotionSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromotionSheet = ({ isOpen, onClose }: PromotionSheetProps) => {
  const [loading, setLoading] = useState(true);
  const { activePopup, isLoading: popupLoading } = usePromotionPopups();
  const { user, userData } = useUser();
  const { handleDontShowAgain } = usePromotion();

  // Simulate loading of promotion content
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Don't show the sheet if:
  // 1. There's no active popup, or
  // 2. User is not authenticated, or
  // 3. User is an admin
  if (
    (!activePopup && !popupLoading && !loading) || 
    !user || 
    userData?.type === 'admin'
  ) {
    return null;
  }

  const handleDontShow = () => {
    handleDontShowAgain();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[350px] rounded-t-3xl p-0 overflow-hidden">
        <SheetTitle className="hidden"></SheetTitle>
        <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full relative">
          {loading || popupLoading ? (
            <div className="p-6 h-full flex flex-col">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-6 w-2/3 mb-8" />
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="mt-6 flex gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full ">
              <div className="mb-4 mx-6 mt-6">
                <h3 className="text-white text-2xl font-bold">{activePopup?.title || '신규회원 할인 혜택'}</h3>
              </div>


              <div className="flex-1 flex items-center justify-between mx-6 mb-6">
                <div className="text-white">
                  <p className="text-lg">  {activePopup?.description || '우리집 첫청소 할인 받고 시작'}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl  text-center w-36 h-36 flex flex-col items-center justify-center">
                  {activePopup?.image_url ? <img src={activePopup.image_url} className="object-cover rounded-xl h-full w-full" alt="Promotion" /> : <div>
                    <p className="text-white text-sm mb-1">COUPON</p>
                    <p className="text-white text-2xl font-bold">10,000원</p>
                    <p className="text-white text-xl font-bold mt-2">10,000원</p></div>}

                </div>
              </div>

              <SheetFooter className="sm:justify-between border-t border-white/20 py-2 bg-white flex flex-row justify-between px-2">
                <Button
                  variant="outline"
                  onClick={handleDontShow}
                  className="text-gray-400 hover:bg-white/20 border-none "
                >
                  다시 보지 않기
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-white text-indigo-600 hover:bg-white/90 "
                >
                  닫기
                </Button>
              </SheetFooter>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PromotionSheet;
