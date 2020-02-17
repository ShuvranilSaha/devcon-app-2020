import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ProfileDetailsPageRoutingModule} from './profile-details-routing.module';

import {ProfileDetailsPage} from './profile-details.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDetailsPageRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileDetailsPage]
})
export class ProfileDetailsPageModule {
}
