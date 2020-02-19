import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {StallAttendancePageRoutingModule} from './stall-attendance-routing.module';

import {StallAttendancePage} from './stall-attendance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StallAttendancePageRoutingModule
  ],
  declarations: [StallAttendancePage]
})
export class StallAttendancePageModule {
}
