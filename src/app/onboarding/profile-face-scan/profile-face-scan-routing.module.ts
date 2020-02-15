import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ProfileFaceScanPage} from './profile-face-scan.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileFaceScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileFaceScanPageRoutingModule {
}
