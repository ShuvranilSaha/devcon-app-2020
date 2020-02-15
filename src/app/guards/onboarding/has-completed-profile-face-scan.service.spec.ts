import {TestBed} from '@angular/core/testing';

import {HasCompletedProfileFaceScanGuard} from './has-completed-profile-face-scan-guard.service';

describe('HasCompletedProfileFaceScanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasCompletedProfileFaceScanGuard = TestBed.get(HasCompletedProfileFaceScanGuard);
    expect(service).toBeTruthy();
  });
});
