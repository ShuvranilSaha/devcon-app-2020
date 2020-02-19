import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionPopupComponent } from './session-popup/session-popup.component';
import { FormsModule } from '@angular/forms';
import { QrcodeDetailsComponent } from './qrcode-details/qrcode-details.component';
import { DcPopupComponent } from './dc-popup/dc-popup.component';

@NgModule({
  declarations: [
    SessionPopupComponent,
    QrcodeDetailsComponent,
    DcPopupComponent
  ],
  entryComponents: [
    SessionPopupComponent,
    QrcodeDetailsComponent,
    DcPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SessionPopupComponent,
    QrcodeDetailsComponent,
    DcPopupComponent
  ]
})
export class ComponentsModule { }
