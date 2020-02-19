import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionPopupComponent } from './session-popup/session-popup.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SessionPopupComponent
  ],
  entryComponents: [
    SessionPopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SessionPopupComponent
  ]
})
export class ComponentsModule { }
