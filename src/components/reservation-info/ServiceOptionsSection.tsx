
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AdditionalServices, { services } from "../home/AdditionalServices";

interface ServiceOptionsSectionProps {
  additionalServices: string[];
  handleAdditionalServiceToggle: (service: string) => void;
  activeDialog: string | null;
  setActiveDialog: (dialog: string | null) => void;
}

const ServiceOptionsSection: React.FC<ServiceOptionsSectionProps> = ({
  additionalServices,
  handleAdditionalServiceToggle,
  activeDialog,
  setActiveDialog
}) => {
  const freeServices = services.filter(service => service.category === "free");
  const paidServices = services.filter(service => service.category === "paid");

  return (
    <div className="border-t border-gray-200 pt-4">
      <span className="flex flex-row items-center mb-4 justify-between">
        <h2 className="text-xl font-bold">서비스 옵션</h2>
        <Dialog open={activeDialog === 'services'} onOpenChange={(open) => setActiveDialog(open ? 'services' : null)}>
          <DialogTrigger asChild>
            <button className="text-gray-500">
              변경
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogTitle>서비스 옵션 수정</DialogTitle>
            <AdditionalServices
              selectedServices={additionalServices}
              onServiceToggle={handleAdditionalServiceToggle}
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
      
      {/* Free Services */}
      {additionalServices.some(id => freeServices.some(service => service.id === id)) && (
        <div className="py-2">
          <h3 className="font-medium">무료 서비스</h3>
          {freeServices.map((option, key) => (
            <>
              {additionalServices.includes(option.id) && (
                <div key={key} className="flex items-center gap-4 my-2">
                  <div className="p-2 rounded-md bg-gray-50">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{option.title}</h3>
                    <p className="text-gray-500 text-sm">{option.subTitle}</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      )}
      
      {/* Paid Services */}
      {additionalServices.some(id => paidServices.some(service => service.id === id)) && (
        <div className="py-2">
          <h3 className="font-medium">유료 서비스</h3>
          {paidServices.map((option, key) => (
            <>
              {additionalServices.includes(option.id) && (
                <div key={key} className="flex items-center gap-4 my-2">
                  <div className="p-2 rounded-md bg-gray-50">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{option.title}</h3>
                    <p className="text-gray-500 text-sm">{option.subTitle}</p>
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      )}
      
      {/* No Services Selected */}
      {additionalServices.length === 0 && (
        <p className="text-gray-400">선택된 서비스 없음</p>
      )}
    </div>
  );
};

export default ServiceOptionsSection;
