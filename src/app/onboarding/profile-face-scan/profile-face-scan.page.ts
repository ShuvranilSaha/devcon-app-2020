import {Component, OnInit} from '@angular/core';
import {faSmile} from '@fortawesome/free-regular-svg-icons/faSmile';
import {faUser} from '@fortawesome/free-regular-svg-icons/faUser';

@Component({
  selector: 'app-profile-face-scan',
  templateUrl: './profile-face-scan.page.html',
  styleUrls: ['./profile-face-scan.page.scss'],
})
export class ProfileFaceScanPage implements OnInit {
  readonly faSmile = faSmile;
  readonly faUser = faUser;

  constructor() {
  }

  ngOnInit() {
  }

}
