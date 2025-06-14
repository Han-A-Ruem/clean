
import React, { createContext, useContext, ReactNode } from 'react';
import useWebView from '@/hooks/useWebView';

// Create context with default values
const WebViewContext = createContext<ReturnType<typeof useWebView> | undefined>(undefined);

// Provider component
export const WebViewProvider = ({ children }: { children: ReactNode }) => {
  const webViewServices = useWebView();
  
  return (
    <WebViewContext.Provider value={webViewServices}>
      {children}
    </WebViewContext.Provider>
  );
};

// Custom hook to use the context
export const useWebViewContext = () => {
  const context = useContext(WebViewContext);
  if (context === undefined) {
    throw new Error('useWebViewContext must be used within a WebViewProvider');
  }
  return context;
};
