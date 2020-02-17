import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {NEVER, Observable} from 'rxjs';
import {HasCompletedOnboardingGuard} from './onboarding/has-completed-onboarding-guard.service';
import {mergeMap} from 'rxjs/operators';
import {HasCompletedWalkthroughGuard} from './walkhthrough/has-completed-walkthrough-guard.service';

@Injectable({
  providedIn: 'root'
})
export class InitialRouteRedirectGuard implements CanLoad, CanActivate {
  constructor(
    private hasCompletedOnboardingGuard: HasCompletedOnboardingGuard,
    private hasCompletedWalkthroughGuard: HasCompletedWalkthroughGuard,
    private router: Router
  ) {
  }

  canLoadOrActivate(route: Route) {
    return this.hasCompletedOnboardingGuard.canLoad(route).pipe(
      mergeMap((hasCompletedOnboarding: boolean) => {
        if (hasCompletedOnboarding) {
          return this.hasCompletedWalkthroughGuard.canLoad(route).pipe(
            mergeMap((hasCompletedWalkthrough) => {
              if (hasCompletedWalkthrough) {
                this.router.navigate(['/home'], {replaceUrl: true});
              } else {
                this.router.navigate(['/walk-through'], {replaceUrl: true});
              }

              return NEVER;
            })
          );
        } else {
          this.router.navigate(['/onboarding'], {replaceUrl: true});
        }

        return NEVER;
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // tslint:disable-next-line:no-non-null-assertion
    return this.canLoadOrActivate(route.routeConfig!);
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.canLoadOrActivate(route);
  }
}
