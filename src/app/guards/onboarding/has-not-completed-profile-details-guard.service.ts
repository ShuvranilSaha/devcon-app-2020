import {Injectable} from '@angular/core';
import {HasCompletedProfileDetailsGuard} from './has-completed-profile-details-guard.service';
import {NEVER, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Route} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HasNotCompletedProfileDetailsGuard extends HasCompletedProfileDetailsGuard {
  canLoad(route: Route): Observable<boolean> {
    return super.canLoad(route).pipe(
      mergeMap((hasCompleted) => {
        if (hasCompleted && route.data && route.data.hasCompletedProfileDetailsRedirect) {
          this.router.navigate([route.data.hasCompletedProfileDetailsRedirect]);

          return NEVER;
        }

        return of(!hasCompleted);
      })
    );
  }
}
