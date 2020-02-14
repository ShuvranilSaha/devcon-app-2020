import {Component, NgZone} from '@angular/core';
import {Camera, CameraOptions, DestinationType, Direction, EncodingType} from '@ionic-native/camera/ngx';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    image = null;
    constructor(private camera: Camera,
                private loadingCtrl: LoadingController,
                private ngZone: NgZone) {
    }

    private async takePicture(confirmChange?: boolean) {
        // opens camera and takes picture
        if (confirmChange) {
            if (!confirm('Are you sure you want to change your pic?')) {
                return false;
            }
        }

        const cameraOptions: CameraOptions = {
            quality: 100,
            sourceType: this.camera.PictureSourceType.CAMERA,
            saveToPhotoAlbum: false,
            correctOrientation: true,
            encodingType: EncodingType.JPEG,
            destinationType: DestinationType.DATA_URL,
            allowEdit: false,
            cameraDirection: this.camera.Direction.FRONT
        };

        const loading = await this.loadingCtrl.create({
            spinner: 'dots',
            duration: 2000,
            message: 'Please wait...',
        });
        await loading.present();
        this.ngZone.run(() => {
            this.camera.getPicture(cameraOptions).then((imagePath) => {
                this.image = 'data:image/png;base64,' + imagePath;
                loading.dismiss();
            });
        });
    }

    private onboarding() {
        // testing slides
        const slideOpts = {

        }
    }
}
