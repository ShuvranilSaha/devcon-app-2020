import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlayerPage } from './player.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { CanvasPlayerService } from '../services/canvas-player.service';

const routes: Routes = [
  {
    path: '',
    component: PlayerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlayerPage],
  providers: [
    CanvasPlayerService,
    ScreenOrientation,
  ]
})
export class PlayerPageModule { }
