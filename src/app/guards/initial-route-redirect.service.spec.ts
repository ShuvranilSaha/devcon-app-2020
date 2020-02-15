import {TestBed} from '@angular/core/testing';

import {InitialRouteRedirectGuard} from './initial-route-redirect-guard.service';

describe('InitialRouteRedirectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InitialRouteRedirectGuard = TestBed.get(InitialRouteRedirectGuard);
    expect(service).toBeTruthy();
  });
});
