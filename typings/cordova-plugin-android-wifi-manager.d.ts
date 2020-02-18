interface Window {
  cordova: Cordova;
}

interface Cordova {
  plugins: CordovaPlugins;
}

interface CordovaPlugins {
  WifiManager: {
    setWifiEnabled: (enabled: boolean, callback: (err: any, success: any) => void) => void;
    isWifiEnabled: (callback: (err: any, wifiEnabled: boolean) => void) => void;
    getScanResults: (callback: (err: any, scanResults: ScanResult[]) => void) => void;
  };
}

interface ScanResult {
  BSSID: string;
  SSID: string;
  capabilities: string;
  centerFreq0: number;
  centerFreq1: number;
  channelWidth: string;
  frequency: number;
  level: number;
  timestamp: number;
}
