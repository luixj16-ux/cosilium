import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 've.go.tsj.consilium',
  appName: 'CONSILIUM',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;