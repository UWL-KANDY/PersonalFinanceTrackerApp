
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aee952c0bea44d3180799f56bcc404e8',
  appName: 'finance-flow-personal-hub',
  webDir: 'dist',
  server: {
    url: "https://aee952c0-bea4-4d31-8079-9f56bcc404e8.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    backgroundColor: "#ffffff"
  }
};

export default config;
