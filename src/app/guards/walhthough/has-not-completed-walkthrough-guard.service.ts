import {Injectable} from '@angular/core';
import {HasCompletedWalkthroughGuard} from './has-completed-walkthrough-guard.service';
import {NEVER, Observable, of} from 'rxjs';
import {Route} from '@angular/router';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HasNotCompletedWalkthroughGuard extends HasCompletedWalkthroughGuard {
  canLoad(route: Route): Observable<boolean> {
    return super.canLoad(route).pipe(
      mergeMap((hasCompleted) => {
        if (hasCompleted && route.data && route.data.hasCompletedWalkthroughRedirect) {
          this.router.navigate([route.data.hasCompletedWalkthroughRedirect]);

          return NEVER;
        }

        return of(!hasCompleted);
      })
    );
  }
}
