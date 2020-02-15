import {TestBed} from '@angular/core/testing';

import {HasNotCompletedOnboardingGuard} from './has-not-completed-onboarding-guard.service';

describe('HasNotCompletedOnboardingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNotCompletedOnboardingGuard = TestBed.get(HasNotCompletedOnboardingGuard);
    expect(service).toBeTruthy();
  });
});
