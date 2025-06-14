
import React, { createContext, useContext, useState } from 'react';

export interface CleanerRegistrationData {
  name?: string;
  interviewStep?: string;
  phone?: string;
  sex?: string;
  workingArea?: string[];
  hearAboutUs?: string;
  nationality?: string;
  birthYear?: string;
  canWorkWithPets?: boolean;
  addressDetail?: string;
  address?: any;
  selectedSite?: string;
  email?: string;
  user_id?: string;
  schedule_id?: string;
  date?: string;
  time_slot?: string;
  wantsInterview?: boolean;
  referral_source?: string;
  // Add other fields here
}

interface CleanerRegistrationContextType {
  data: CleanerRegistrationData;
  setData: React.Dispatch<React.SetStateAction<CleanerRegistrationData>>;
}

const CleanerRegistrationContext = createContext<CleanerRegistrationContextType | undefined>(undefined);

export const CleanerRegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CleanerRegistrationData>({});

  return (
    <CleanerRegistrationContext.Provider value={{ data, setData }}>
      {children}
    </CleanerRegistrationContext.Provider>
  );
};

export const useCleanerRegistration = () => {
  const context = useContext(CleanerRegistrationContext);
  if (!context) throw new Error('useCleanerRegistration must be used within a CleanerRegistrationProvider');
  return context;
};
