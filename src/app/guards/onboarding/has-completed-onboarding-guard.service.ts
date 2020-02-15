import {Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {HasCompletedProfileFaceScanGuard} from './has-completed-profile-face-scan-guard.service';
import {HasCompletedProfileDetailsGuard} from './has-completed-profile-details-guard.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasCompletedOnboardingGuard implements CanLoad {
  constructor(
    private hasCompletedProfileFaceScanGuard: HasCompletedProfileFaceScanGuard,
    private hasCompletedProfileDetailsGuard: HasCompletedProfileDetailsGuard,
    protected router: Router
  ) {
  }

  canLoad(route: Route): Observable<boolean> {
    return combineLatest([
      this.hasCompletedProfileDetailsGuard.canLoad(route),
      this.hasCompletedProfileFaceScanGuard.canLoad(route)
    ]).pipe(
      take(1),
      map(([hasCompletedProfileDetails, hasCompletedProfileFaceScan]) => {
        return (hasCompletedProfileDetails && hasCompletedProfileFaceScan);
      })
    );
  }
}
