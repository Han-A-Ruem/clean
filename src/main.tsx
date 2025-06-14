
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

// Initialize Capacitor web plugins
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize plugins on device ready
document.addEventListener('deviceready', () => {
  StatusBar.setStyle({ style: Style.Light });
  SplashScreen.hide();
}, false);

createRoot(document.getElementById("root")!).render(<App />);
