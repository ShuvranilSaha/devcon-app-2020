import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { Tab3Page } from './tab3.page';
import {ExploreContainerComponentModule} from '../../explore-container/explore-container.module';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{path: '', component: Tab3Page}])
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
