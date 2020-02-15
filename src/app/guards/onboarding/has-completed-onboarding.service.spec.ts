import {TestBed} from '@angular/core/testing';

import {HasCompletedOnboardingGuard} from './has-completed-onboarding-guard.service';

describe('HasCompletedOnboardingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasCompletedOnboardingGuard = TestBed.get(HasCompletedOnboardingGuard);
    expect(service).toBeTruthy();
  });
});
