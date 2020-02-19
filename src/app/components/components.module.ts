import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionPopupComponent } from './session-popup/session-popup.component';
import { FormsModule } from '@angular/forms';
import { QrcodeDetailsComponent } from './qrcode-details/qrcode-details.component';

@NgModule({
  declarations: [
    SessionPopupComponent,
    QrcodeDetailsComponent
  ],
  entryComponents: [
    SessionPopupComponent,
    QrcodeDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SessionPopupComponent,
    QrcodeDetailsComponent
  ]
})
export class ComponentsModule { }
