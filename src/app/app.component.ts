import {Component, OnInit} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NotificationService as LocalNotification } from './services/notification.service';
import { PushNotificationService } from './services/push-notification';
import {NavigationEnd, Router} from '@angular/router';
import {filter, take, tap} from 'rxjs/operators';
import { ContentUtil } from './services/content.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private notificationSrc: LocalNotification,
    private pushNotificationService: PushNotificationService,
    private conettnUtil: ContentUtil,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeApp();
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
    });

    this.notificationSrc.setupLocalNotification();

    if (this.platform.is('cordova')) {
      this.pushNotificationService.setupPush();
    }
  }
}
