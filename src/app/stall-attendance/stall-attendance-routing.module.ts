import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {StallAttendancePage} from './stall-attendance.page';

const routes: Routes = [
  {
    path: '',
    component: StallAttendancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StallAttendancePageRoutingModule {
}
