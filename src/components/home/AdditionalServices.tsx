
import React from "react";
import { WashingMachine, Frame, Home, Shirt, Building, PawPrint, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ServiceType = {
  id: string;
  title: string;
  subTitle: string;
  category: "free" | "paid";
  icon: React.ReactNode;
};

interface AdditionalServicesProps {
  selectedServices: string[];
  onServiceToggle: (service: string) => void;
}

const services: ServiceType[] = [
  // Free services (무료 서비스)
  {
    id: "laundry",
    title: "세탁",
    subTitle: "무료 서비스",
    category: "free",
    icon: <WashingMachine className="w-8 h-8" strokeWidth={1} />,
  },
  {
    id: "windowFrame",
    title: "창틀",
    subTitle: "+30분 추가",
    category: "free",
    icon: <Frame className="w-8 h-8" strokeWidth={1} />,
  },
  {
    id: "veranda",
    title: "베란다",
    subTitle: "+30분 추가",
    category: "free",
    icon: <Home className="w-8 h-8" strokeWidth={1} />,
  },
  {
    id: "ironing",
    title: "다림질",
    subTitle: "기본 3~5장, +30분 추가",
    category: "free",
    icon: <Shirt className="w-8 h-8" strokeWidth={1} />,
  },
  {
    id: "duplex",
    title: "복층 청소",
    subTitle: "+30분 추가",
    category: "free",
    icon: <Building className="w-8 h-8" strokeWidth={1} />,
  },

  // Paid service (유료 서비스)
  {
    id: "petCare",
    title: "반려동물 용품 케어",
    subTitle: "화장실 청소, 용품 세탁 +10,000원",
    category: "paid",
    icon: <PawPrint className="w-8 h-8" strokeWidth={1} />,
  },
];

const AdditionalServiceCard: React.FC<{
  service: ServiceType;
  selected: boolean;
  onToggle: () => void;
}> = ({ service, selected, onToggle }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 mb-3">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-md bg-gray-50">
          {service.icon}
        </div>
        <div>
          <h3 className="font-medium text-lg">{service.title}</h3>
          <p className="text-gray-500 text-sm">{service.subTitle}</p>
        </div>
      </div>
      <Button 
        onClick={onToggle}
        variant="ghost" 
        size="icon" 
        className={cn(
          "rounded-full border hover:bg-[#2F3033] hover:text-white", 
          selected ? "bg-[#2F3033] text-white" : "bg-white text-gray-500"
        )}
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

const AdditionalServices: React.FC<AdditionalServicesProps> = ({
  selectedServices,
  onServiceToggle
}) => {
  // Filter free and paid services
  const freeServices = services.filter(service => service.category === "free");
  const paidServices = services.filter(service => service.category === "paid");

  return (
    <div className="pt-4">
      <h2 className="text-xl font-semibold mb-4">추가 서비스</h2>
      
      {/* Free Services Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">무료 서비스</h3>
        <p className="text-gray-500 text-sm mb-3">시간이 추가된 서비스는 매니저님이 현장에서 시간 추가 요청할 수 있습니다.</p>
        <div className="space-y-2">
          {freeServices.map((service) => (
            <AdditionalServiceCard
              key={service.id}
              service={service}
              selected={selectedServices.includes(service.id)}
              onToggle={() => onServiceToggle(service.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Paid Services Section */}
      {paidServices.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">유료 서비스</h3>
          <div className="space-y-2">
            {paidServices.map((service) => (
              <AdditionalServiceCard
                key={service.id}
                service={service}
                selected={selectedServices.includes(service.id)}
                onToggle={() => onServiceToggle(service.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { services };
export default AdditionalServices;
