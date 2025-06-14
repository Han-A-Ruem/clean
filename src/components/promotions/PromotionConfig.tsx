
import React, { useEffect } from "react";
import { usePromotion } from "@/contexts/PromotionContext";

interface PromotionConfigProps {
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * A component that controls the visibility of promotions.
 * When a component is wrapped with this, promotions will not be shown.
 * When the component unmounts, it resets to the default state.
 */
const PromotionConfig: React.FC<PromotionConfigProps> = ({ 
  children, 
  disabled = true 
}) => {
  const { disablePromotions, resetToDefault } = usePromotion();
  
  useEffect(() => {
    // If disabled is true, disable promotions when this component mounts
    if (disabled) {
      disablePromotions();
    }
    
    // Reset to default when component unmounts
    return () => {
      resetToDefault();
    };
  }, [disabled, disablePromotions, resetToDefault]);
  
  return <>{children}</>;
};

export default PromotionConfig;
