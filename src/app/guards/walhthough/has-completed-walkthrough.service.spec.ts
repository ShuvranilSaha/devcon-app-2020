import {TestBed} from '@angular/core/testing';

import {HasCompletedWalkthroughGuard} from './has-completed-walkthrough-guard.service';

describe('HasCompletedWalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HasCompletedWalkthroughGuard = TestBed.get(HasCompletedWalkthroughGuard);
    expect(service).toBeTruthy();
  });
});
