
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePromotionPopups } from "@/hooks/usePromotionPopups";
import { useUser } from "@/contexts/UserContext";

interface PromotionContextType {
  showPromotion: boolean;
  setShowPromotion: (show: boolean) => void;
  disablePromotions: () => void;
  enablePromotions: () => void;
  handleDontShowAgain: () => void;
  resetToDefault: () => void;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export const usePromotion = () => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error("usePromotion must be used within a PromotionProvider");
  }
  return context;
};

interface PromotionProviderProps {
  children: React.ReactNode;
}

export const PromotionProvider: React.FC<PromotionProviderProps> = ({ children }) => {
  const [showPromotion, setShowPromotion] = useState<boolean>(false);
  const [promotionsDisabled, setPromotionsDisabled] = useState<boolean>(false);
  const { activePopup } = usePromotionPopups();
  const { user, userData, loading } = useUser();

  // Check if promotions should be shown whenever dependencies change
  useEffect(() => {
    const checkPromotionVisibility = () => {
      const dontShowAgain = localStorage.getItem('dontShowPromotionAgain') === 'true';
      
      // Only show promotion if:
      // 1. There's an active popup
      // 2. User is authenticated
      // 3. User is not an admin
      // 4. Promotions are not disabled by a component
      // 5. User hasn't opted out of promotions
      if (
        !dontShowAgain && 
        activePopup && 
        user && 
        userData?.type !== 'admin' && 
        !loading && 
        !promotionsDisabled
      ) {
        setShowPromotion(true);
      } else {
        setShowPromotion(false);
      }
    };

    checkPromotionVisibility();
  }, [activePopup, user, userData, loading, promotionsDisabled]);

  // Function to disable promotions temporarily
  const disablePromotions = () => {
    setPromotionsDisabled(true);
  };

  // Function to enable promotions again
  const enablePromotions = () => {
    setPromotionsDisabled(false);
  };

  // Reset to default state - check if promotions should be shown based on current conditions
  const resetToDefault = () => {
    setPromotionsDisabled(false);
  };

  // Function to handle "Don't show again" option
  const handleDontShowAgain = () => {
    localStorage.setItem('dontShowPromotionAgain', 'true');
    setShowPromotion(false);
  };

  const value = {
    showPromotion,
    setShowPromotion,
    disablePromotions,
    enablePromotions,
    handleDontShowAgain,
    resetToDefault,
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};

export default PromotionProvider;
