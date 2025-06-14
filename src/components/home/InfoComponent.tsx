
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomerInfo } from "@/types/booking";
import AdditionalServices from "./AdditionalServices";
import {
  HousekeepingInfo,
  ContactInfo,
  EntryInfo,
  TrashDisposalInfo,
  CleaningToolsInfo
} from "@/components/reservation-info";
import { ReservationFormData } from "@/types/reservation";
import { PageHeader } from "../Utils";
import { formatKoreanWon } from "@/utils/formatters";

interface InfoComponentProps {
  reservationInfo: ReservationFormData;
  setReservationData: (reservation: Partial<ReservationFormData>) => void;
  className?: string;
  onBack?: () => void;
  onSubmit: () => void;
}

const InfoComponent: React.FC<InfoComponentProps> = ({
  reservationInfo,
  setReservationData,
  className,
  onBack,
  onSubmit,
}) => {
  const [additionalServices, setAdditionalServices] = useState(
    reservationInfo.additional_service || [ ]
  );

  // Update local state when customerInfo changes from parent
  useEffect(() => {
    if (reservationInfo.additional_service) {
      const currentServices = JSON.stringify(additionalServices);
      const incomingServices = JSON.stringify(reservationInfo.additional_service);

      if (currentServices !== incomingServices) {
        setAdditionalServices(reservationInfo.additional_service);
      }
    }
  }, [reservationInfo.additional_service]);

  // Update parent state when additionalServices changes locally
  useEffect(() => {
    const currentServices = reservationInfo.additional_service ?
      JSON.stringify(reservationInfo.additional_service) :
      "{}";
    const localServices = JSON.stringify(additionalServices);

    if (currentServices !== localServices) {
      setReservationData({ additional_service:  additionalServices });
      
      // Convert to array of service names for the reservation data
      const serviceArray = Object.entries(additionalServices)
        .filter(([_, isSelected]) => isSelected)
        .map(([service]) => service);
      
      // Fix: Use correct field name that matches the database schema
      // updateReservationByField('additional_service', serviceArray);
    }
  }, [additionalServices, setReservationData, reservationInfo.additional_service ]);


  const handleAdditionalServiceToggle = (service: string) => {
    console.log('ser', service)
    setAdditionalServices(prev => {
      const updatedServices = prev.includes(service)
        ? prev.filter(s => s !== service) // Remove if already exists
        : [...prev, service]; // Add if not exists
  
      setReservationData({ additional_service: updatedServices }); // Use updated value
  
      return updatedServices; // Correctly update state
    });
  };
  

  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className={cn("space-y-6 animate-fade-in pb-20", className)}>
    <PageHeader title=""/>
      <div className="space-y-6 px-4">
        <CleaningToolsInfo
          customerInfo={reservationInfo}
          onCustomerInfoChange={setReservationData}
        />

        <HousekeepingInfo
          customerInfo={reservationInfo}
          onCustomerInfoChange={setReservationData}
        />

        <ContactInfo
          customerInfo={reservationInfo}
          onCustomerInfoChange={setReservationData}
        />

        <EntryInfo
          customerInfo={reservationInfo}
          onCustomerInfoChange={setReservationData}
        />

        <TrashDisposalInfo
          customerInfo={reservationInfo}
          onCustomerInfoChange={setReservationData}
        />

        <div>
          <h4 className="pt-2 font-medium text-lg mb-4">관리자</h4>
          <textarea
            value={"미제공 서비스 안내에 입력될 내용은 서비스 내용이 정리되는대로 공유드리겠습니다! (추후 전달 예정)"}
            onChange={(e) => { }}
            className="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary- bg-gray-100"
            readOnly
          />
        </div>

        <AdditionalServices
          selectedServices={additionalServices}
          onServiceToggle={handleAdditionalServiceToggle}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-transparent z-10">
        <div className="container max-w-full w-full mx-auto px-4 py-4 flex items-center justify-between border-t border-gray-100 bg-white">
          <div>
            <span className="text-2xl font-bold">{formatKoreanWon(reservationInfo.amount)}</span>
            <p className="text-sm text-gray-600">자세히</p>
          </div>
          <button onClick={handleSubmit} className="bg-primary-user text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoComponent;
