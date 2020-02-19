import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {StallAttendancePage} from './stall-attendance.page';

describe('StallAttendancePage', () => {
  let component: StallAttendancePage;
  let fixture: ComponentFixture<StallAttendancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StallAttendancePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StallAttendancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
