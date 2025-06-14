
import { useState, useEffect, useCallback } from 'react';
import WebViewService from '@/services/webviewService';
import { toast } from 'sonner';

/**
 * A hook that provides WebView functionality
 */
export const useWebView = () => {
  const [isWebView, setIsWebView] = useState(false);
  
  useEffect(() => {
    // Check if running in a WebView environment
    setIsWebView(WebViewService.isWebViewSupported());
  }, []);

  const postMessage = useCallback((message: string | object) => {
    return WebViewService.postMessage(message);
  }, []);
  
  const addMessageListener = useCallback((callback: (data: any) => void) => {
    const handler = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' 
          ? JSON.parse(event.data) 
          : event.data;
        callback(data);
      } catch (error) {
        console.error('Error parsing WebView message:', error);
        callback(event.data);
      }
    };
    
    return WebViewService.addMessageListener(handler);
  }, []);

  return {
    isWebView,
    postMessage,
    addMessageListener
  };
};

export default useWebView;
