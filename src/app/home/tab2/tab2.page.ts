import {Component} from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public isWifiEnabled = false;
  public recognizedBSSIDResult?: ScanResult;
  public recognizedBSSIDResult2?: ScanResult;
  public readonly JSON = JSON;
  private readonly ourSSID = 'devcon_tracker1';
  private readonly ourSSID2 = 'ehashed';
  private wifiManager = window.cordova.plugins.WifiManager;
  private intervalRef?: any;

  constructor() {
  }

  ionViewWillEnter() {
    this.initScan();
  }

  ionViewWillLeave() {
    this.deinitScan();
  }

  enableWifi() {
    this.wifiManager.setWifiEnabled(true, (err, success) => {
    });
  }

  initScan() {
    this.intervalRef = window.setInterval(() => {
      this.wifiManager.isWifiEnabled((err, enabled: boolean) => {
        this.isWifiEnabled = enabled;

        if (enabled) {
          this.wifiManager.getScanResults((_, scanResults) => {
            this.recognizedBSSIDResult = scanResults.find((r) => r.SSID === this.ourSSID);
            this.recognizedBSSIDResult2 = scanResults.find((r) => r.SSID === this.ourSSID2);
            this.wifiManager.startScan(() => {
            });
          });
        }
      });
    }, 5000);
  }

  deinitScan() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
      this.intervalRef = undefined;
      this.recognizedBSSIDResult = undefined;
    }
  }

}
