
import { Capacitor } from '@capacitor/core';

/**
 * A service that provides access to WebView functionality
 * This can be used alongside native Capacitor features
 */
export const WebViewService = {
  /**
   * Checks if the current environment supports WebView
   */
  isWebViewSupported(): boolean {
    // Check if we're in a React Native environment
    return typeof window !== 'undefined' && 
           typeof (window as any).ReactNativeWebView !== 'undefined';
  },

  /**
   * Sends a message to the React Native WebView
   */
  postMessage(message: string | object): boolean {
    if (!this.isWebViewSupported()) {
      console.warn('WebView messaging is not supported in this environment');
      return false;
    }
    
    try {
      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      (window as any).ReactNativeWebView.postMessage(messageStr);
      return true;
    } catch (error) {
      console.error('Error posting message to WebView:', error);
      return false;
    }
  },
  
  /**
   * Adds an event listener for WebView messages
   */
  addMessageListener(callback: (event: MessageEvent) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }
    
    window.addEventListener('message', callback);
    return () => window.removeEventListener('message', callback);
  }
};

export default WebViewService;
