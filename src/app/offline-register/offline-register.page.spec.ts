import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfflineRegisterPage } from './offline-register.page';

describe('OfflineRegisterPage', () => {
  let component: OfflineRegisterPage;
  let fixture: ComponentFixture<OfflineRegisterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineRegisterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfflineRegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
