import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfileFaceScanPageRoutingModule} from './profile-face-scan-routing.module';

import {ProfileFaceScanPage} from './profile-face-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileFaceScanPageRoutingModule
  ],
  declarations: [ProfileFaceScanPage]
})
export class ProfileFaceScanPageModule {
}
