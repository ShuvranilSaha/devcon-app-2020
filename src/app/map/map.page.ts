import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  dismissModal() {
    this.navCtrl.back({animated: true, animationDirection: 'back'});
  }
}
