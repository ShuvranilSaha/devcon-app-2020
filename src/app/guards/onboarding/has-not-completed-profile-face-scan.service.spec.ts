import {TestBed} from '@angular/core/testing';

import {HasNotCompletedProfileFaceScanGuard} from './has-not-completed-profile-face-scan-guard.service';

describe('HasNotCompletedProfileFaceScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNotCompletedProfileFaceScanGuard = TestBed.get(HasNotCompletedProfileFaceScanGuard);
    expect(service).toBeTruthy();
  });
});
