
import { useState, useCallback, useEffect } from 'react';
import CapacitorService from '@/services/capacitorService';
import { Capacitor } from '@capacitor/core';

/**
 * A hook that provides access to Capacitor native device functionalities
 * and handles availability checks for different platforms
 */
export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  
  useEffect(() => {
    // Check if running on a native platform (iOS, Android)
    setIsNative(Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android');
  }, []);

  // Camera functions
  const takePicture = useCallback(async () => {
    if (!isNative) {
      console.warn('Camera functionality is only available on native platforms');
      return null;
    }
    return await CapacitorService.camera.takePicture();
  }, [isNative]);

  const pickImage = useCallback(async () => {
    if (!isNative) {
      console.warn('Camera functionality is only available on native platforms');
      return null;
    }
    return await CapacitorService.camera.pickFromGallery();
  }, [isNative]);

  // Share function
  const share = useCallback(async (title: string, text: string, url?: string) => {
    if (!isNative) {
      // Fallback to Web Share API if available
      if (navigator.share) {
        return navigator.share({ title, text, url });
      }
      console.warn('Share functionality is only available on native platforms or browsers that support Web Share API');
      return;
    }
    return await CapacitorService.sharing.share(title, text, url);
  }, [isNative]);

  // Geolocation functions
  const getCurrentPosition = useCallback(async () => {
    if (!isNative) {
      // Fallback to Web Geolocation API
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed
            },
            timestamp: position.timestamp
          }),
          error => reject(error)
        );
      });
    }
    return await CapacitorService.location.getCurrentPosition();
  }, [isNative]);

  // Toast functionality
  const showToast = useCallback(async (message: string, duration: 'short' | 'long' = 'short') => {
    if (!isNative) {
      console.warn('Toast functionality is only available on native platforms');
      // Simple fallback using alert for web
      alert(message);
      return;
    }
    return await CapacitorService.toast.show(message, duration);
  }, [isNative]);

  // Notifications
  const scheduleNotification = useCallback(async (title: string, body: string, id = 1) => {
    if (!isNative) {
      console.warn('Local notifications are only available on native platforms');
      return;
    }
    return await CapacitorService.notifications.schedule(title, body, id);
  }, [isNative]);

  // Device info
  const getDeviceInfo = useCallback(async () => {
    if (!isNative) {
      // Return basic web info as fallback
      return {
        name: 'Web Browser',
        platform: 'web',
        operatingSystem: navigator.platform,
        osVersion: navigator.userAgent,
        isVirtual: false
      };
    }
    return await CapacitorService.device.getInfo();
  }, [isNative]);

  // Network status
  const getNetworkStatus = useCallback(async () => {
    if (!isNative) {
      // Return navigator.onLine status for web
      return { connected: navigator.onLine, connectionType: navigator.onLine ? 'wifi' : 'none' };
    }
    return await CapacitorService.network.getStatus();
  }, [isNative]);

  return {
    isNative,
    camera: {
      takePicture,
      pickImage
    },
    share,
    location: {
      getCurrentPosition,
      watchPosition: CapacitorService.location.watchPosition,
      clearWatch: CapacitorService.location.clearWatch
    },
    filesystem: CapacitorService.filesystem,
    device: {
      getInfo: getDeviceInfo,
      getBatteryInfo: CapacitorService.device.getBatteryInfo
    },
    notifications: {
      schedule: scheduleNotification
    },
    toast: {
      show: showToast
    },
    clipboard: CapacitorService.clipboard,
    statusBar: CapacitorService.statusBar,
    app: CapacitorService.app,
    network: {
      getStatus: getNetworkStatus,
      addListener: CapacitorService.network.addListener
    }
  };
};

export default useCapacitor;
