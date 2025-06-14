
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Recycle, Trash, Apple } from "lucide-react";
import { ReservationFormData } from "@/types/reservation";
import { TrashDisposalInfo } from "./index";

interface TrashDisposalSectionProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
}

const TrashDisposalSection: React.FC<TrashDisposalSectionProps> = ({
  customerInfo,
  onCustomerInfoChange,
  activeDialog,
  setActiveDialog
}) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <span className="flex flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-bold">쓰레기 배출 및 주의사항</h2>
        <Dialog open={activeDialog === 'trashDisposal'} onOpenChange={(open) => setActiveDialog(open ? 'trashDisposal' : null)}>
          <DialogTrigger asChild>
            <button className="text-gray-500 mt-2">
              변경
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogTitle>쓰레기 배출 및 주의사항 수정</DialogTitle>
            <TrashDisposalInfo
              customerInfo={customerInfo}
              onCustomerInfoChange={onCustomerInfoChange}
            />
            <Button
              className="w-full mt-4"
              onClick={() => setActiveDialog(null)}
            >
              완료
            </Button>
          </DialogContent>
        </Dialog>
      </span>
      <div>
        <h3 className="font-medium">쓰레기 배출</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className={`flex items-center ${customerInfo.dispose_types && customerInfo.dispose_types.includes('recyclable') ? 'text-gray-600' : 'text-gray-200'}`}>
            <div className="p-2 rounded-full">
              <Recycle className="w-8 h-8" />
            </div>
            <span>재활용 분리수거</span>
          </div>
          <div className={`flex items-center ${customerInfo.dispose_types && customerInfo.dispose_types.includes('general') ? 'text-gray-600' : 'text-gray-200'}`}>
            <div className="p-2 rounded-full">
              <Trash className="w-8 h-8" />
            </div>
            <span>일반 쓰레기</span>
          </div>
          <div className={`flex items-center ${customerInfo.dispose_types && customerInfo.dispose_types.includes('food') ? 'text-gray-600' : 'text-gray-200'}`}>
            <div className="p-2 rounded-full">
              <Apple className="w-8 h-8" />
            </div>
            <span>음식물 쓰레기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashDisposalSection;
