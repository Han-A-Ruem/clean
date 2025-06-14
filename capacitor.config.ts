
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tenxblitz.clean',
  appName: 'clean-connect-app',
  webDir: 'dist',
  server: {
    url: 'http://192.168.55.109:3000',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#3880ff"
    }
  }
};

export default config;
