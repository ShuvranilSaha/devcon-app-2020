import {Component, OnInit} from '@angular/core';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  readonly faLock = faLock;
  readonly faPaperPlane = faPaperPlane;
  public submitSuccess = false;

  public profileDetailsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-z ,.'-]+$/i)])
  });

  get nameControl(): FormControl {
    return this.profileDetailsForm.get('name') as FormControl;
  }

  constructor() {
  }

  ngOnInit() {
  }

  submitForm() {
    this.submitSuccess = true;
  }

}
