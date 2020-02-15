import {Injectable} from '@angular/core';
import {HasCompletedProfileFaceScanGuard} from './has-completed-profile-face-scan-guard.service';
import {NEVER, Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Route} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HasNotCompletedProfileFaceScanGuard extends HasCompletedProfileFaceScanGuard {
  canLoad(route: Route): Observable<boolean> {
    return super.canLoad(route).pipe(
      mergeMap((hasCompleted) => {
        if (hasCompleted && route.data && route.data.hasCompletedProfileFaceScanRedirect) {
          this.router.navigate([route.data.hasCompletedProfileFaceScanRedirect]);

          return NEVER;
        }

        return of(!hasCompleted);
      })
    );
  }
}
