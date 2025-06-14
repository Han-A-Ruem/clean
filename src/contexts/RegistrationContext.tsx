
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

// Define the type for user registration data
interface RegistrationData {
  address?: {
    main: string;
    detail: string;
  };
  personalInfo?: {
    name: string;
    phone: string;
    residentId: string;
  };
  bankInfo?: {
    bankName: string;
    accountNumber: string;
  };
  termsAgreed?: boolean;
  promisesAgreed?: boolean;
}

// Define the context type
interface RegistrationContextType {
  registrationData: RegistrationData;
  updateAddress: (address: { main: string; detail: string }) => void;
  updatePersonalInfo: (info: { name: string; phone: string; residentId: string }) => void;
  updateBankInfo: (info: { bankName: string; accountNumber: string }) => void;
  agreeToTerms: (agreed: boolean) => void;
  agreeToPromises: (agreed: boolean) => void;
  saveRegistrationData: () => Promise<void>;
  clearRegistrationData: () => void;
}

// Create the context with default values
const RegistrationContext = createContext<RegistrationContextType>({
  registrationData: {},
  updateAddress: () => {},
  updatePersonalInfo: () => {},
  updateBankInfo: () => {},
  agreeToTerms: () => {},
  agreeToPromises: () => {},
  saveRegistrationData: async () => {},
  clearRegistrationData: () => {},
});

// Create a provider component
export const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});

  // Update address information
  const updateAddress = (address: { main: string; detail: string }) => {
    setRegistrationData(prev => ({ ...prev, address }));
  };

  // Update personal information
  const updatePersonalInfo = (info: { name: string; phone: string; residentId: string }) => {
    setRegistrationData(prev => ({ ...prev, personalInfo: info }));
  };

  // Update bank information
  const updateBankInfo = (info: { bankName: string; accountNumber: string }) => {
    setRegistrationData(prev => ({ ...prev, bankInfo: info }));
  };

  // Update terms agreement
  const agreeToTerms = (agreed: boolean) => {
    setRegistrationData(prev => ({ ...prev, termsAgreed: agreed }));
  };

  // Update promises agreement
  const agreeToPromises = (agreed: boolean) => {
    setRegistrationData(prev => ({ ...prev, promisesAgreed: agreed }));
  };

  // Save all registration data to the database
  const saveRegistrationData = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "인증 오류",
          description: "사용자 인증 정보가 없습니다.",
        });
        return;
      }

      // Update the user record
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: registrationData.personalInfo?.name,
          address: registrationData.address ? `${registrationData.address.main} ${registrationData.address.detail}` : undefined,
          bank_name: registrationData.bankInfo?.bankName,
          bank_account: registrationData.bankInfo?.accountNumber ? parseInt(registrationData.bankInfo.accountNumber) : undefined,
          status: registrationData.promisesAgreed ? 'active' : 'pending',
          type: 'cleaner',
        });

      if (error) {
        console.error("Error updating user data:", error);
        toast({
          variant: "destructive",
          title: "오류가 발생했습니다",
          description: "사용자 정보를 저장하는 중 오류가 발생했습니다.",
        });
        return;
      }

      toast({
        title: "정보가 저장되었습니다",
        description: "회원 등록이 완료되었습니다.",
      });
    } catch (error) {
      console.error("Error in saveRegistrationData:", error);
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다",
        description: "사용자 정보를 저장하는 중 오류가 발생했습니다.",
      });
    }
  };

  // Clear all registration data
  const clearRegistrationData = () => {
    setRegistrationData({});
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateAddress,
        updatePersonalInfo,
        updateBankInfo,
        agreeToTerms,
        agreeToPromises,
        saveRegistrationData,
        clearRegistrationData,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Custom hook to use the registration context
export const useRegistration = () => useContext(RegistrationContext);
