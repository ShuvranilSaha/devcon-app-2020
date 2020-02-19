import { Router } from '@angular/router';
import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { Course, EventsBusService } from '@project-sunbird/sunbird-sdk';
import { CanvasPlayerService } from '../services/canvas-player.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html'
})
export class PlayerPage {

  NEXT_CONTENT = 'event:NextContent';
  config: any = {};
  backButtonSubscription!: Subscription;
  course!: Course;
  // pauseSubscription: any;
  // isFromToc: boolean;
  // corRelationList;

  private endGenieCanvasSubscription?: Subscription;

  @ViewChild('preview', { static: false }) previewElement!: ElementRef;
  constructor(
    private canvasPlayerService: CanvasPlayerService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    // private events: Events,
    @Inject('EVENTS_BUS_SERVICE') private eventsBusService: EventsBusService,
    private alertCtrl: AlertController,
    private router: Router,
    private location: Location
  ) {
    this.canvasPlayerService.handleAction();

    // Binding following methods to making it available to content player which is an iframe
    // (window as any).onContentNotFound = this.onContentNotFound.bind(this);
    // (window as any).onUserSwitch = this.onUserSwitch.bind(this);

    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      this.config = currentNavigation.extras.state.config;
      this.course = currentNavigation.extras.state.course;
      // this.isFromToc = currentNavigation.extras.state.isFromTOC;
      // this.corRelationList = currentNavigation.extras.state.corRelation;
    }
  }

  // ngOnInit() {
  //   this.pauseSubscription = this.platform.pause.subscribe(() => {
  //     var iframes = window.document.getElementsByTagName('iframe');
  //     if (iframes.length > 0) {
  //       iframes[0].contentWindow.postMessage('pause.youtube', '*');
  //     }
  //   });
  // }

  ionViewWillEnter() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.statusBar.hide();

    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(10, async () => {
      const activeAlert = await this.alertCtrl.getTop();
      if (!activeAlert) {
        this.showConfirm();
      }
    });
    this.config.uid = this.config.context.actor.id;
    this.config.metadata.basePath = '/_app_file_' + this.config.metadata.basePath;

    if (this.config.metadata.isAvailableLocally) {
      this.config.metadata.contentData.streamingUrl = '/_app_file_' + this.config.metadata.contentData.streamingUrl;
    }

    // This is to reload a iframe as iframes reload method not working on cross-origin.
    const src = this.previewElement.nativeElement.src;
    this.previewElement.nativeElement.src = '';
    this.previewElement.nativeElement.src = src;
    this.previewElement.nativeElement.onload = () => {
      console.log('config', this.config);
      setTimeout(() => {
        this.previewElement.nativeElement.contentWindow.cordova = window.cordova;
        // this.previewElement.nativeElement.contentWindow['Media'] = window['Media'];
        this.previewElement.nativeElement.contentWindow.initializePreview(this.config);
        // this.previewElement.nativeElement.contentWindow.addEventListener('message', resp => {
        //     console.log('Player Response', resp);
        //     if (resp.data === 'renderer:question:submitscore') {
        //         // this.courseService.syncAssessmentEvents().subscribe();
        //     }
        // });
      }, 1000);
    };

    // this.events.subscribe('endGenieCanvas', (res) => {
    //   if (res.showConfirmBox) {
    //     this.showConfirm();
    //   } else {
    //     this.closeIframe();
    //   }
    // });
    this.endGenieCanvasSubscription = this.eventsBusService.events('player' as any).pipe(
      filter((e) => e.type === 'endGenieCanvas'),
    ).subscribe((e) => {
      if (e.payload.showConfirmBox) {
        this.showConfirm();
      } else {
        this.closeIframe();
      }
    });
  }

  ionViewWillLeave() {
    this.statusBar.show();
    this.screenOrientation.unlock();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    // if (this.events) {
    // this.events.unsubscribe('endGenieCanvas');
    // }
    if (this.endGenieCanvasSubscription) {
      this.endGenieCanvasSubscription.unsubscribe();
    }

    if (this.backButtonSubscription) {
      this.backButtonSubscription.unsubscribe();
    }
    window.removeEventListener('renderer:question:submitscore', () => { });
  }

  // ngOnDestroy() {
  //   if (this.pauseSubscription) {
  //     this.pauseSubscription.unsubscribe();
  //   }

  // }

  /**
   * This will trigger from player/ iframe when it unable to find consecutive content
   * @param identifier Content Identifier
   * @param hierarchyInfo Object of content hierarchy
   */
  // onContentNotFound(identifier: string, hierarchyInfo: Array<HierarchyInfo>) {
  //   const content = { identifier, hierarchyInfo };

  //   // Migration todo
  //   /*     this.navCtrl.push(ContentDetailsPage, {
  //         content: content
  //       }).then(() => {
  //         // Hide player while going back
  //         this.navCtrl.remove(this.navCtrl.length() - 2);
  //       });
  //    */
  //   setTimeout(() => {
  //       this.closeIframe();
  //   }, 1000);
  //   this.events.publish(this.NEXT_CONTENT, {
  //       content,
  //       course: this.course
  //   });
  // }

  /**
   * This is an callback to mobile when player switches user
   * @param selectedUser User id of the newly selected user by player
   */
  // onUserSwitch(selectedUser: User) {
  //   // this.appGlobalService.setSelectedUser(selectedUser);
  // }

  /**
   * This will close the player page and will fire some end telemetry events from the player
   */
  closeIframe() {
    const stageId = this.previewElement.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
    try {
      this.previewElement.nativeElement.contentWindow.TelemetryService.exit(stageId);
    } catch (err) {
      console.error('End telemetry error:', err.message);
    }
    // this.events.publish(EventTopics.PLAYER_CLOSED, {
    //    selectedUser: this.appGlobalService.getSelectedUser()
    // });

    // if (this.isFromToc) {
    // this.router.navigate([RouterLinks.CONTENT_DETAILS], {
    //   state: {
    //     content: this.config['metadata'],
    //     corRelation: this.corRelationList,
    //     shouldNavigateBack: true
    //   },
    //   replaceUrl: true
    // });
    // } else {
    this.location.back();
    // }
  }


  /**
   * This will show confirmation box while leaving the player, it will fire some telemetry events from the player.
   */
  async showConfirm() {
    const type = (this.previewElement.nativeElement.contentWindow.Renderer
      && !this.previewElement.nativeElement.contentWindow.Renderer.running) ? 'EXIT_APP' : 'EXIT_CONTENT';
    const stageId = this.previewElement.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
    this.previewElement.nativeElement.contentWindow.TelemetryService.interact(
      'TOUCH', 'DEVICE_BACK_BTN', 'EXIT', { type: type, stageId: stageId });

    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Would you like to leave this content?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.previewElement.nativeElement.contentWindow.TelemetryService.interact(
              'TOUCH', 'ALERT_CANCEL', 'EXIT', { type: type, stageId: stageId });
          }
        },
        {
          text: 'Okay',
          handler: () => {
            this.previewElement.nativeElement.contentWindow.TelemetryService.interact(
              'END', 'ALERT_OK', 'EXIT', { type: type, stageId: stageId });
            this.previewElement.nativeElement.contentWindow.TelemetryService.interrupt('OTHER', stageId);
            this.previewElement.nativeElement.contentWindow.EkstepRendererAPI.dispatchEvent('renderer:telemetry:end');

            this.closeIframe();
          }
        }
      ]
    });
    await alert.present();
  }
}
