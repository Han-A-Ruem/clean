
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ReservationFormData } from "@/types/reservation";
import { FloatingActionButton, BottomPriceBar } from "@/components/reservation-info";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import our new component sections
import HeaderSection from "./HeaderSection";
import HouseInfoSection from "./HouseInfoSection";
import ServiceOptionsSection from "./ServiceOptionsSection";
import TrashDisposalSection from "./TrashDisposalSection";
import CautionSection from "./CautionSection";
import { format } from "path";
import { formatKoreanWon } from "@/utils/formatters";

interface ReminderComponentProps {
  customerInfo: ReservationFormData;
  onCustomerInfoChange: (info: Partial<ReservationFormData>) => void;
  className?: string;
  onBack?: () => void;
  onNext?: () => void;
  title?: string;
  subtitle?: string;
  date?: string;
  time?: string;
  price?: string;
}

const ReminderComponent: React.FC<ReminderComponentProps> = ({
  customerInfo,
  onCustomerInfoChange,
  className,
  onBack,
  onNext,
  title = "매주 화요일",
  subtitle = "예약을 완료해 주세요.",
  date = "2.4(화)",
  time = "15:00~19:00(4시간)",
  price = "30,160원"
}) => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [addressData, setAddressData] = useState<string | null>(null);
  const [additionalServices, setAdditionalServices] = useState<string[]>(
    customerInfo.additional_service || []
  );
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);
  const [isBottom, setIsBottom] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (customerInfo.additional_service) {
      setAdditionalServices(customerInfo.additional_service);
    }
  }, [customerInfo.additional_service]);

  useEffect(() => {
    const fetchAddressData = async () => {
      if (customerInfo.address && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerInfo.address)) {
        const { data, error } = await supabase
          .from('addresses')
          .select('address')
          .eq('id', customerInfo.address)
          .single();

        if (data && !error) {
          setAddressData(data.address);
        }
      } else {
        setAddressData(customerInfo.address);
      }
    };

    fetchAddressData();
  }, [customerInfo.address]);

  const handleAdditionalServiceToggle = (service: string) => {
    setAdditionalServices(prevServices => {
      const updatedServices = prevServices.includes(service)
        ? prevServices.filter(s => s !== service)
        : [...prevServices, service];
      
      onCustomerInfoChange({ additional_service: updatedServices });
      
      return updatedServices;
    });
  };

  const handleTermsAgreementChange = (checked: boolean) => {
    setTermsAgreed(checked);
  };

  const handleNextClick = () => {
    if (!termsAgreed) {
      toast.error("이용약관에 동의해주세요.");
      return;
    }
    
    if (onNext) onNext();
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={cn("space-y-6 animate-fade-in pb-24", className)}>
      {/* Header Section */}
      <HeaderSection 
        title={title}
        subtitle={subtitle}
        date={date}
        time={time}
      />

      <div className="space-y-4 px-4">
        {/* House Information Section */}
        <HouseInfoSection 
          customerInfo={customerInfo}
          onCustomerInfoChange={onCustomerInfoChange}
          addressData={addressData}
          activeDialog={activeDialog}
          setActiveDialog={setActiveDialog}
        />

        {/* Service Options Section */}
        <ServiceOptionsSection 
          additionalServices={additionalServices}
          handleAdditionalServiceToggle={handleAdditionalServiceToggle}
          activeDialog={activeDialog}
          setActiveDialog={setActiveDialog}
        />

        {/* Trash Disposal Section */}
        <TrashDisposalSection 
          customerInfo={customerInfo}
          onCustomerInfoChange={onCustomerInfoChange}
          activeDialog={activeDialog}
          setActiveDialog={setActiveDialog}
        />
      </div>

      {/* Caution Section with Terms Agreement */}
      <CautionSection 
        termsAgreed={termsAgreed}
        onTermsAgreementChange={handleTermsAgreementChange}
      />

      <div ref={bottomRef} className="h-[1px]"></div>

      <FloatingActionButton scrollToBottom={scrollToBottom} />

      {(isBottom || termsAgreed ) && onNext && (
        <BottomPriceBar 
          price={formatKoreanWon(customerInfo.amount)} 
          onNext={handleNextClick} 
          disabled={!termsAgreed}
        />
      )}
    </div>
  );
};

export default ReminderComponent;
