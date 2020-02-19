import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfflineRegisterPage } from './offline-register.page';

const routes: Routes = [
  {
    path: '',
    component: OfflineRegisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfflineRegisterPageRoutingModule {}
