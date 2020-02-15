import {TestBed} from '@angular/core/testing';

import {HasNotCompletedWalkthroughGuard} from './has-not-completed-walkthrough-guard.service';

describe('HasNotCompletedWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasNotCompletedWalkthroughGuard = TestBed.get(HasNotCompletedWalkthroughGuard);
    expect(service).toBeTruthy();
  });
});
