import {Injectable} from '@angular/core';
import {HasCompletedOnboardingGuard} from './has-completed-onboarding-guard.service';
import {NEVER, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Route} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HasNotCompletedOnboardingGuard extends HasCompletedOnboardingGuard {
  canLoad(route: Route): Observable<boolean> {
    return super.canLoad(route).pipe(
      mergeMap((hasCompleted) => {
        if (hasCompleted && route.data && route.data.hasCompletedOnboardingRedirect) {
          this.router.navigate([route.data.hasCompletedOnboardingRedirect]);

          return NEVER;
        }

        return of(!hasCompleted);
      })
    );
  }
}
