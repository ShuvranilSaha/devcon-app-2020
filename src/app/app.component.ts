import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NotificationService as LocalNotification} from './services/notification.service';
import {PushNotificationService} from './services/push-notification';
import {NavigationEnd, Router} from '@angular/router';
import {filter, mergeMap, take, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {ContentUtil} from './services/content.service';
import {TelemetryAutoSyncService, TelemetryService} from '@project-sunbird/sunbird-sdk';
import {StallServiceImpl} from './services/stall/stall-service-impl';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  private telemetryAutoSync: TelemetryAutoSyncService;
  public recognizedBSSIDResult?: ScanResult;
  public recognizedBSSIDResult2?: ScanResult;
  private wifiManager = window.cordova.plugins.WifiManager;
  private readonly ourSSID = 'devcon_tracker1';
  private readonly ourSSID2 = 'ehashed';

  constructor(
    @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationSrc: LocalNotification,
    private pushNotificationService: PushNotificationService,
    private conettnUtil: ContentUtil,
    private router: Router,
    private stallService: StallServiceImpl
  ) {
    this.telemetryAutoSync = this.telemetryService.autoSync;
  }

  ngOnInit(): void {
    this.initializeApp();

    this.wifiManager.setWifiEnabled(true, (err, success) => {
    });

    window.setInterval(() => {
      this.wifiManager.isWifiEnabled((err, enabled: boolean) => {
        if (enabled) {
          this.wifiManager.getScanResults((_, scanResults) => {
            this.recognizedBSSIDResult = scanResults.find((r) => r.SSID === this.ourSSID);
            this.recognizedBSSIDResult2 = scanResults.find((r) => r.SSID === this.ourSSID2);

            if (
              this.recognizedBSSIDResult && this.recognizedBSSIDResult.level > 50 &&
              this.recognizedBSSIDResult2 && this.recognizedBSSIDResult2.level > 50
            ) {
              this.stallService.onExitDetected();
            }

            this.wifiManager.startScan(() => {
            });
          });
        }
      });
    }, 5000);
  }

  ngAfterViewInit(): void {
    this.platform.resume.subscribe(() => {
      this.notificationSrc.handleNotification();
    });

    // this.platform.pause.subscribe(() => {
    //   this.telemetryGeneratorService.generateInterruptTelemetry('background', '');
    // });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        take(1),
        tap(() => {
          this.splashScreen.hide();
        })
      ).subscribe();
      this.statusBar.styleDefault();
      this.conettnUtil.importContent();
      this.autoSyncTelemetry();
    });

    this.notificationSrc.setupLocalNotification();

    if (this.platform.is('cordova')) {
      this.pushNotificationService.setupPush();
    }
  }

  private autoSyncTelemetry() {
    this.telemetryAutoSync.start(30 * 1000).pipe(
      mergeMap(() => {
        return combineLatest([
          this.platform.pause.pipe(tap(() => this.telemetryAutoSync.pause())),
          this.platform.resume.pipe(tap(() => this.telemetryAutoSync.continue()))
        ]);
      })
    ).subscribe();
  }
}
