import {Inject, Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {SharedPreferences} from '@project-sunbird/sunbird-sdk';
import {PreferenceKeys} from '../../../config/preference-keys';

@Injectable({
  providedIn: 'root'
})
export class HasCompletedProfileFaceScanGuard implements CanLoad {
  constructor(
    @Inject('SHARED_PREFERENCES') private sharedPreferences: SharedPreferences,
    protected router: Router
  ) {
  }

  canLoad(route: Route): Observable<boolean> {
    // return of(true);
    return of(!!window.localStorage.getItem(PreferenceKeys.Onboarding.PROFILE_FACE_SCAN_COMPLETE));
  }
}
