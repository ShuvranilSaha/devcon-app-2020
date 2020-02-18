import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {faSmile} from '@fortawesome/free-regular-svg-icons/faSmile';
import {faUser} from '@fortawesome/free-regular-svg-icons/faUser';
import {AndroidPermission, AndroidPermissionsService} from '../../services/android-permissions.service';
import {LoadingController, NavController, Platform} from '@ionic/angular';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {PreferenceKeys} from '../../../config/preference-keys';

@Component({
  selector: 'app-profile-face-scan',
  templateUrl: './profile-face-scan.page.html',
  styleUrls: ['./profile-face-scan.page.scss'],
})
export class ProfileFaceScanPage implements OnInit, OnDestroy {
  readonly faSmile = faSmile;
  readonly faUser = faUser;

  get isPlatformIos() {
    return this.platform.is('ios');
  }

  @ViewChild('cameraPreviewRef', {static: false, read: ElementRef}) cameraPreviewRef!: ElementRef;
  @ViewChild('cameraIosPreviewRef', {static: false, read: ElementRef}) cameraIosPreviewRef!: ElementRef;
  @ViewChild('canvasPreviewRef', {static: false, read: ElementRef}) canvasPreviewRef!: ElementRef;
  @ViewChild('facePreviewRef', {static: false, read: ElementRef}) facePreviewRef!: ElementRef;
  cameraStarted = false;
  faceCaptured = false;
  private cameraStream?: MediaStream;
  private cameraPreview!: HTMLVideoElement;
  private cameraIosPreview!: HTMLCanvasElement;
  private canvasPreview!: HTMLCanvasElement;
  private cameraWidth!: number;
  private cameraHeight!: number;
  private cameraScale = 0;
  private cameraMiniWidth!: number;
  private cameraMiniHeight!: number;
  private canvasPreviewCtx: any;
  private facePreviewCtx: any;
  private faceBox = {
    size: 0,
    x: 0,
    y: 0
  };

  private prevFaceBox = {
    size: 0,
    x: 0,
    y: 0
  };

  constructor(
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
    private androidPermissionsService: AndroidPermissionsService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private platform: Platform
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((track) => track.stop());
      this.cameraStream = undefined;
    }
  }

  public resetFaceScan() {
    this.faceCaptured = false;
  }

  public async startFaceScan() {
    if (this.platform.is('android')) {
      const status = await this.androidPermissionsService.checkPermissions([AndroidPermission.CAMERA]).toPromise();

      if (!status[AndroidPermission.CAMERA] || !status[AndroidPermission.CAMERA].hasPermission) {
        const requestStatus = await this.androidPermissionsService.requestPermission(AndroidPermission.CAMERA).toPromise();

        if (!requestStatus.hasPermission) {
          return;
        }
      }
    }

    this.cameraIosPreview = this.cameraIosPreviewRef.nativeElement as HTMLCanvasElement;
    this.cameraPreview = this.cameraPreviewRef.nativeElement as HTMLVideoElement;
    this.canvasPreview = this.canvasPreviewRef.nativeElement as HTMLCanvasElement;

    this.canvasPreviewCtx = this.canvasPreview.getContext('2d', {alpha: false});

    this.facePreviewCtx = (this.facePreviewRef.nativeElement as HTMLCanvasElement).getContext('2d', {alpha: false});

    if (this.platform.is('ios')) {
      // @ts-ignore
      window.plugin.CanvasCamera.initialize(this.cameraIosPreview);
      this.cameraIosPreview.style.minHeight = '100%';
    } else {
      this.cameraPreview.style.minHeight = '100%';
    }

    this.canvasPreview.style.width = '450px';
    this.canvasPreview.style.height = 'inherit';

    this.openCamera();
    this.initFaceDetection();
  }

  initFaceDetection() {
    const sizeFrameMemory = 30;
    window.facedetection.initFaceDetection(
      sizeFrameMemory,
      './assets/facedetection-lite/facefinder',
      () => {
        this.processFrame();
        this.updateFacePreview();
      });
  }


  openCamera() {
    if (this.platform.is('ios')) {
      const self = this;
      // tslint:disable-next-line:only-arrow-functions
      const onAfterDraw = function () {
        self.cameraStarted = true;
        self.handleCameraSize();
      };
      const options = {
        use: 'file',
        fps: 15,
        hasThumbnail: false,
        cameraFacing: 'front',
        onAfterDraw
      };

      // @ts-ignore
      window.plugin.CanvasCamera.start(options);
    } else if (navigator.mediaDevices !== undefined) {
      const videoObj = {
        audio: false,
        video: {
          width: {min: 320, max: 1800},
          height: {min: 320, max: 1800},
          frameRate: {ideal: 10, max: 15},
          facingMode: {deal: 'environment'}
        }
      } as any;

      navigator.mediaDevices.getUserMedia(videoObj).then((stream) => {
        this.cameraStarted = true;
        this.cameraPreview.srcObject = stream;
        this.cameraPreview.play();

        this.cameraStream = stream;
      }, (error: any) => {
        console.error('Video capture error: ', error.code);
      });

      this.cameraPreview.onloadedmetadata = this.handleCameraSize.bind(this);
    } else {
      const errBack = (error: any) => {
        console.log('Video capture error: ', error.code);
      };

      const videoObj = {
        video: true,
        audio: false
      };

      const browser = navigator;

      browser.getUserMedia = (
        browser.getUserMedia
      );

      browser.getUserMedia(videoObj, (stream) => {
        this.cameraPreview.src = window.URL.createObjectURL(stream);
        this.cameraPreview.play();

        this.cameraStream = stream;
      }, errBack);

      this.cameraPreview.onloadedmetadata = this.handleCameraSize.bind(this);
    }
  }

  private handleCameraSize() {
    if (this.platform.is('ios')) {
      this.cameraWidth = this.cameraIosPreview.width;
      this.cameraHeight = this.cameraIosPreview.height;
    } else {
      if (!this.cameraPreview) {
        this.cameraPreview = this.cameraPreviewRef.nativeElement as HTMLVideoElement;
        this.canvasPreview = this.canvasPreviewRef.nativeElement as HTMLCanvasElement;
        this.canvasPreviewCtx = this.canvasPreview.getContext('2d', {alpha: false});
      }

      this.cameraWidth = this.cameraPreview.videoWidth;
      this.cameraHeight = this.cameraPreview.videoHeight;
    }

    const maxSize = Math.max(this.cameraWidth, this.cameraHeight);
    const cameraScaleTemp = 95 / maxSize;
    if (this.cameraScale !== cameraScaleTemp) {
      this.cameraScale = cameraScaleTemp;
      this.cameraMiniWidth = parseInt((this.cameraWidth * this.cameraScale) as any, 10);
      this.cameraMiniHeight = parseInt((this.cameraHeight * this.cameraScale) as any, 10);

      this.canvasPreview.width = this.cameraMiniWidth;
      this.canvasPreview.height = this.cameraMiniHeight;
    }
  }

  private processFrame() {
    if (this.canvasPreviewCtx === undefined || this.cameraMiniWidth === undefined || Number.isNaN(this.cameraMiniWidth)) {
      this.handleCameraSize();
    } else {
      this.canvasPreviewCtx.drawImage(
        this.platform.is('ios') ? this.cameraIosPreview : this.cameraPreview,
        0, 0, this.cameraWidth, this.cameraHeight,
        0, 0, this.cameraMiniWidth, this.cameraMiniHeight
      );

      const rgba = this.canvasPreviewCtx.getImageData(0, 0, this.cameraMiniWidth, this.cameraMiniHeight).data;

      window.facedetection.detections(
        rgba,
        this.cameraMiniWidth,
        this.cameraMiniHeight,
        this.cameraMiniWidth * 0.2,
        this.cameraMiniWidth * 1.2,
        0.1,
        (dets: any) => {

          const greaterFace = Math.max.apply(
            Math,
            dets.map((o: any) => {
              return o[2];
            })
          );

          for (let i = 0; i < dets.length; ++i) {
            const box = dets[i];
            if (box[2] !== greaterFace || box[3] === undefined) {
              continue;
            }

            this.canvasPreviewCtx.beginPath();
            this.canvasPreviewCtx.arc(box[1], box[0], box[2] / 2, 0, 2 * Math.PI, false);
            this.canvasPreviewCtx.lineWidth = 1;
            this.canvasPreviewCtx.strokeStyle = 'red';
            this.canvasPreviewCtx.stroke();

            const data = this.canvasPreview.toDataURL();

            this.faceBox = {
              x: box[1] - ((box[2] + 20) / 2),
              y: box[0] - ((box[2] + 20) / 2),
              size: box[2] + 20
            };
          }
        });
    }

    window.setTimeout(() => {
      this.processFrame();
    }, 30);
  }

  private updateFacePreview() {
    const loop = () => {
      if (this.faceBox.x > 0 && !this.faceCaptured) {
        const size = parseInt((this.faceBox.size / this.cameraScale) as any, 10);

        let faceSizeOriginal: HTMLCanvasElement | null = document.createElement('canvas');
        faceSizeOriginal.width = size;
        faceSizeOriginal.height = size;

        let faceSizeOriginalCtx = faceSizeOriginal.getContext('2d', {alpha: false});

        faceSizeOriginalCtx!.drawImage(
          this.platform.is('ios') ? this.cameraIosPreview : this.cameraPreview,
          parseInt(this.faceBox.x / this.cameraScale as any, 10),
          parseInt(this.faceBox.y / this.cameraScale as any, 10),
          size, size,
          0, 0, size, size
        );

        this.facePreviewCtx.drawImage(
          faceSizeOriginal,
          0, 0, faceSizeOriginal.width, faceSizeOriginal.height,
          0, 0, 130, 130
        );

        faceSizeOriginal = null;
        faceSizeOriginalCtx = null;

        if (JSON.stringify(this.prevFaceBox) !== JSON.stringify(this.faceBox)) {
          this.prevFaceBox = {...this.faceBox};
          setTimeout(() => {
            this.faceCaptured = true;
          }, 500);
        }
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }

  async faceUpload() {
    const loader = await this.loadingCtrl.create({
      showBackdrop: true,
      duration: 2000,
      spinner: 'dots'
    });
    await loader.present();
    window.localStorage.setItem(PreferenceKeys.Onboarding.PROFILE_FACE_SCAN_COMPLETE, 'true');
    // todo subranil: save image metadata into device navigate to upload-user-name page
    await loader.dismiss();
    await this.navCtrl.navigateRoot('/walk-through', {
      animated: true, animationDirection: 'forward'
    });
  }
}
