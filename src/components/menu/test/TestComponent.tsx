
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useCapacitorContext } from '@/contexts/CapacitorContext';
import { useWebViewContext } from '@/contexts/WebViewContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Camera, Share, MapPin, Clock, Bell, Battery, Clipboard, Info, Wifi, X } from 'lucide-react';

const TestComponent = () => {
  const capacitor = useCapacitorContext();
  const webView = useWebViewContext();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearResults = () => {
    setResult(null);
    setError(null);
  };

  const handleAction = async (action: () => Promise<any>, label: string) => {
    clearResults();
    try {
      const res = await action();
      setResult(`${label} success: ${JSON.stringify(res || 'Completed')}`);
      console.log(`${label} result:`, res);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`${label} error: ${errorMessage}`);
      console.error(`${label} error:`, err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Native Functionality Tests</h1>
        <div className="flex gap-2">
          {capacitor.isNative ? (
            <Badge variant="success">Native Mode</Badge>
          ) : (
            <Badge variant="warning">Browser Mode</Badge>
          )}
          {webView.isWebView && <Badge variant="success">WebView</Badge>}
        </div>
      </div>

      {(result || error) && (
        <div className="mb-4 p-3 border rounded-md bg-gray-50 relative">
          <button 
            className="absolute right-2 top-2 p-1 rounded-full hover:bg-gray-200"
            onClick={clearResults}
          >
            <X size={16} />
          </button>
          {result && <div className="text-sm text-green-600 break-words">{result}</div>}
          {error && <div className="text-sm text-red-600 break-words">{error}</div>}
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-medium mb-2">Camera & Media</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleAction(capacitor.camera.takePicture, 'Take Picture')}>
              <Camera size={16} className="mr-2" /> Take Picture
            </Button>
            <Button onClick={() => handleAction(capacitor.camera.pickImage, 'Pick Image')}>
              <Camera size={16} className="mr-2" /> Pick Image
            </Button>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">Share</h2>
          <Button 
            onClick={() => handleAction(() => 
              capacitor.share('Test Share', 'This is a test share from the app', 'https://lovable.ai'), 'Share'
            )}
            className="w-full"
          >
            <Share size={16} className="mr-2" /> Share Content
          </Button>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">Location</h2>
          <Button 
            onClick={() => handleAction(capacitor.location.getCurrentPosition, 'Get Location')}
            className="w-full"
          >
            <MapPin size={16} className="mr-2" /> Get Current Location
          </Button>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">Device Info</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleAction(capacitor.device.getInfo, 'Device Info')}>
              <Info size={16} className="mr-2" /> Device Info
            </Button>
            <Button onClick={() => handleAction(capacitor.device.getBatteryInfo, 'Battery Info')}>
              <Battery size={16} className="mr-2" /> Battery Info
            </Button>
            <Button onClick={() => handleAction(capacitor.network.getStatus, 'Network Status')}>
              <Wifi size={16} className="mr-2" /> Network Status
            </Button>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">Notifications & UI</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleAction(() => 
              capacitor.toast.show('This is a test toast message'), 'Show Toast'
            )}>
              <Bell size={16} className="mr-2" /> Show Toast
            </Button>
            <Button onClick={() => handleAction(() => 
              capacitor.notifications.schedule('Test Notification', 'This is a test notification'), 'Schedule Notification'
            )}>
              <Clock size={16} className="mr-2" /> Notification
            </Button>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">Clipboard</h2>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => handleAction(() => 
              capacitor.clipboard.write('Text copied from test app'), 'Write to Clipboard'
            )}>
              <Clipboard size={16} className="mr-2" /> Copy Text
            </Button>
            <Button onClick={() => handleAction(capacitor.clipboard.read, 'Read Clipboard')}>
              <Clipboard size={16} className="mr-2" /> Read Clipboard
            </Button>
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-medium mb-2">WebView</h2>
          <div className="space-y-2">
            <Button onClick={() => {
              const message = {
                type: 'TEST_MESSAGE', 
                timestamp: new Date().toISOString(),
                data: { test: true }
              };
              webView.postMessage(message);
              setResult(`Message sent to WebView: ${JSON.stringify(message)}`);
            }} className="w-full">
              Send Message to WebView
            </Button>
          </div>
        </section>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Note: Some functionalities only work on native devices and may fail in browser environments.</p>
        <p>Check console logs for more detailed information about results and errors.</p>
      </div>
    </div>
  );
};

export default TestComponent;
