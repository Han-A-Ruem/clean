
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { Geolocation, Position } from '@capacitor/geolocation';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { Toast } from '@capacitor/toast';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Clipboard } from '@capacitor/clipboard';
import { StatusBar } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';

/**
 * A service that provides access to Capacitor native device functionalities
 */
export const CapacitorService = {
  // Camera functionality
  camera: {
    async takePicture() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        });
        return image;
      } catch (error) {
        console.error('Error taking picture:', error);
        throw error;
      }
    },

    async pickFromGallery() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: true,
          resultType: CameraResultType.Uri,
          source: CameraSource.Photos
        });
        return image;
      } catch (error) {
        console.error('Error picking from gallery:', error);
        throw error;
      }
    }
  },

  // Share functionality
  sharing: {
    async share(title: string, text: string, url?: string) {
      try {
        await Share.share({
          title,
          text,
          url,
          dialogTitle: 'Share with buddies'
        });
      } catch (error) {
        console.error('Error sharing:', error);
        throw error;
      }
    }
  },

  // Geolocation
  location: {
    async getCurrentPosition(): Promise<Position> {
      try {
        return await Geolocation.getCurrentPosition();
      } catch (error) {
        console.error('Error getting position:', error);
        throw error;
      }
    },

    async watchPosition(callback: (position: Position) => void) {
      try {
        const watchId = await Geolocation.watchPosition({}, callback);
        return watchId;
      } catch (error) {
        console.error('Error watching position:', error);
        throw error;
      }
    },

    clearWatch(watchId: string) {
      Geolocation.clearWatch({ id: watchId });
    }
  },

  // File system
  filesystem: {
    async writeFile(path: string, data: string) {
      try {
        const result = await Filesystem.writeFile({
          path,
          data,
          directory: Directory.Documents
        });
        return result;
      } catch (error) {
        console.error('Error writing file:', error);
        throw error;
      }
    },

    async readFile(path: string) {
      try {
        const contents = await Filesystem.readFile({
          path,
          directory: Directory.Documents
        });
        return contents;
      } catch (error) {
        console.error('Error reading file:', error);
        throw error;
      }
    }
  },

  // Device info
  device: {
    async getInfo() {
      try {
        return await Device.getInfo();
      } catch (error) {
        console.error('Error getting device info:', error);
        throw error;
      }
    },

    async getBatteryInfo() {
      try {
        return await Device.getBatteryInfo();
      } catch (error) {
        console.error('Error getting battery info:', error);
        throw error;
      }
    }
  },

  // Notifications
  notifications: {
    async schedule(title: string, body: string, id = 1) {
      try {
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id,
              schedule: { at: new Date(Date.now() + 1000) }
            }
          ]
        });
      } catch (error) {
        console.error('Error scheduling notification:', error);
        throw error;
      }
    }
  },

  // Toast messages
  toast: {
    async show(text: string, duration: 'short' | 'long' = 'short') {
      try {
        await Toast.show({
          text,
          duration
        });
      } catch (error) {
        console.error('Error showing toast:', error);
        throw error;
      }
    }
  },

  // Clipboard
  clipboard: {
    async write(text: string) {
      try {
        await Clipboard.write({
          string: text
        });
      } catch (error) {
        console.error('Error writing to clipboard:', error);
        throw error;
      }
    },

    async read() {
      try {
        const { value } = await Clipboard.read();
        return value;
      } catch (error) {
        console.error('Error reading from clipboard:', error);
        throw error;
      }
    }
  },

  // Status bar
  statusBar: {
    hide() {
      StatusBar.hide();
    },
    show() {
      StatusBar.show();
    }
  },

  // App
  app: {
    async getInfo() {
      try {
        return await App.getInfo();
      } catch (error) {
        console.error('Error getting app info:', error);
        throw error;
      }
    },
    
    async getLaunchUrl() {
      try {
        return await App.getLaunchUrl();
      } catch (error) {
        console.error('Error getting launch URL:', error);
        throw error;
      }
    },
    
    exitApp() {
      App.exitApp();
    }
  },

  // Network
  network: {
    async getStatus() {
      try {
        return await Network.getStatus();
      } catch (error) {
        console.error('Error getting network status:', error);
        throw error;
      }
    },
    
    addListener(callback: (status: { connected: boolean; connectionType: string }) => void) {
      const handler = Network.addListener('networkStatusChange', callback);
      return handler;
    }
  }
};

export default CapacitorService;
