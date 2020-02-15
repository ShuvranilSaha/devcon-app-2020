import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {ProfileFaceScanPage} from './profile-face-scan.page';

describe('ProfileFaceScanPage', () => {
  let component: ProfileFaceScanPage;
  let fixture: ComponentFixture<ProfileFaceScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileFaceScanPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFaceScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
