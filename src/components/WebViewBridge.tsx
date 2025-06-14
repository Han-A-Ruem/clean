
import React, { useEffect, useState } from 'react';
import { useWebViewContext } from '@/contexts/WebViewContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WebViewBridgeProps {
  onMessage?: (data: any) => void;
}

const WebViewBridge: React.FC<WebViewBridgeProps> = ({ onMessage }) => {
  const { isWebView, postMessage, addMessageListener } = useWebViewContext();
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  useEffect(() => {
    // Set up message listener
    const removeListener = addMessageListener((data) => {
      setLastMessage(typeof data === 'string' ? data : JSON.stringify(data));
      if (onMessage) onMessage(data);
    });

    // Clean up listener
    return () => removeListener();
  }, [addMessageListener, onMessage]);

  const sendTestMessage = () => {
    postMessage({
      type: 'TEST_MESSAGE',
      content: 'Hello from WebView Bridge!',
      timestamp: new Date().toISOString()
    });
  };

  if (!isWebView) {
    return (
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <Badge variant="warning">Not Running in WebView</Badge>
        <p className="mt-2 text-sm text-gray-500">
          This component is designed to bridge communication with a React Native WebView.
          You're currently viewing this in a browser environment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="success">WebView Connected</Badge>
        <Button size="sm" onClick={sendTestMessage}>
          Send Test Message
        </Button>
      </div>
      
      {lastMessage && (
        <div className="mt-4">
          <h4 className="text-sm font-medium">Last Received Message:</h4>
          <pre className="p-2 mt-1 text-xs bg-gray-100 rounded overflow-auto max-h-32">
            {lastMessage}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WebViewBridge;
