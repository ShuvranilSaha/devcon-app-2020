import {TestBed} from '@angular/core/testing';

import {HasNotCompletedProfileDetailsGuard} from './has-not-completed-profile-details-guard.service';

describe('HasNotCompletedProfileDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNotCompletedProfileDetailsGuard = TestBed.get(HasNotCompletedProfileDetailsGuard);
    expect(service).toBeTruthy();
  });
});
