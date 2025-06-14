
import React, { createContext, useContext, ReactNode } from 'react';
import useCapacitor from '@/hooks/useCapacitor';

// Create context with default values
const CapacitorContext = createContext<ReturnType<typeof useCapacitor> | undefined>(undefined);

// Provider component
export const CapacitorProvider = ({ children }: { children: ReactNode }) => {
  const capacitorServices = useCapacitor();
  
  return (
    <CapacitorContext.Provider value={capacitorServices}>
      {children}
    </CapacitorContext.Provider>
  );
};

// Custom hook to use the context
export const useCapacitorContext = () => {
  const context = useContext(CapacitorContext);
  if (context === undefined) {
    throw new Error('useCapacitorContext must be used within a CapacitorProvider');
  }
  return context;
};
