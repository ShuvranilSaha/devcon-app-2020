import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfflineRegisterPageRoutingModule } from './offline-register-routing.module';

import { OfflineRegisterPage } from './offline-register.page';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        OfflineRegisterPageRoutingModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
  declarations: [OfflineRegisterPage]
})
export class OfflineRegisterPageModule {}
