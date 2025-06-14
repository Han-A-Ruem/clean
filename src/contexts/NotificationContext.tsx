
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Types for notification positions
export type NotificationPosition = 
  | "top-right" 
  | "top-center" 
  | "top-left" 
  | "bottom-right" 
  | "bottom-center" 
  | "bottom-left";

export interface NotificationConfig {
  position?: NotificationPosition;
  offset?: string;
  reset?: boolean;
}

interface NotificationContextType {
  config: NotificationConfig;
  updateConfig: (newConfig: NotificationConfig) => void;
  resetConfig: () => void;
}

// Default configuration
const defaultConfig: NotificationConfig = {
  position: "top-center",
  offset: "1rem", // Default to 4rem from top (64px)
  reset: false,
};

export const NotificationContext = createContext<NotificationContextType>({
  config: defaultConfig,
  updateConfig: () => {},
  resetConfig: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<NotificationConfig>(defaultConfig);

  const updateConfig = (newConfig: NotificationConfig) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig, reset: false }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  // Set CSS variable to control positioning in the DOM
  useEffect(() => {
    if (config.offset) {
      document.documentElement.style.setProperty('--notification-offset', config.offset);
    }
    
    return () => {
      // Clean up CSS variable when component unmounts
      document.documentElement.style.removeProperty('--notification-offset');
    };
  }, [config.offset]);

  return (
    <NotificationContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Component to easily configure notifications for a specific page/component
export const NotificationConfig: React.FC<NotificationConfig & { children: ReactNode }> = ({ 
  children, 
  ...configProps 
}) => {
  const { updateConfig, resetConfig } = useNotification();
  
  useEffect(() => {
    updateConfig(configProps);
    
    return () => {
      // If reset is true, reset to defaults when unmounted
      if (configProps.reset !== false) {
        resetConfig();
      }
    };
  }, [configProps.position, configProps.offset, configProps.reset]);

  return <>{children}</>;
};
