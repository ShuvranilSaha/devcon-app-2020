import {TestBed} from '@angular/core/testing';

import {HasCompletedProfileDetailsGuard} from './has-completed-profile-details-guard.service';

describe('HasCompletedProfileDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasCompletedProfileDetailsGuard = TestBed.get(HasCompletedProfileDetailsGuard);
    expect(service).toBeTruthy();
  });
});
