import {Inject, Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {PreferenceKeys} from '../../../config/preference-keys';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';

@Injectable({
  providedIn: 'root'
})
export class HasCompletedProfileDetailsGuard implements CanLoad {
  constructor(
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
    protected router: Router
  ) {
  }

  canLoad(route: Route): Observable<boolean> {
    // return of(true);
    return of(!!window.localStorage.getItem(PreferenceKeys.Onboarding.PROFILE_DETAILS_COMPLETE));
  }
}
