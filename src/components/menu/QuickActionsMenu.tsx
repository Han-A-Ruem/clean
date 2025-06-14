
import React from "react";
import { CircleDollarSign, PhoneOutgoing, ShoppingBag, Star } from "lucide-react";

const QuickActionsMenu = () => {
  return (
    <div className="grid grid-cols-4 py-6 px-4 gap-4">
      <QuickActionItem icon={<CircleDollarSign className="w-6 h-6" />} label="정산 내역" />
      <QuickActionItem icon={<Star className="w-6 h-6" />} label="고객 후기" />
      <QuickActionItem icon={<ShoppingBag className="w-6 h-6" />} label="특가몰" />
      <QuickActionItem icon={<PhoneOutgoing className="w-6 h-6" />} label="상담 문의" />
    </div>
  );
};

const QuickActionItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full border flex items-center justify-center mb-2">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default QuickActionsMenu;
