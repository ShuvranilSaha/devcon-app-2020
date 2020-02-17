import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {InitialRouteRedirectGuard} from './guards/initial-route-redirect-guard.service';
import {HasCompletedOnboardingGuard} from './guards/onboarding/has-completed-onboarding-guard.service';
import {HasCompletedProfileFaceScanGuard} from './guards/onboarding/has-completed-profile-face-scan-guard.service';
import {HasNotCompletedProfileFaceScanGuard} from './guards/onboarding/has-not-completed-profile-face-scan-guard.service';
import {HasNotCompletedProfileDetailsGuard} from './guards/onboarding/has-not-completed-profile-details-guard.service';
import {HasNotCompletedOnboardingGuard} from './guards/onboarding/has-not-completed-onboarding-guard.service';
import {HasNotCompletedWalkthroughGuard} from './guards/walkhthrough/has-not-completed-walkthrough-guard.service';
import {HasCompletedWalkthroughGuard} from './guards/walkhthrough/has-completed-walkthrough-guard.service';

const routes: Routes = [
  {
    path: '',
    children: [],
    canLoad: [InitialRouteRedirectGuard],
    canActivate: [InitialRouteRedirectGuard]
  },
  {
    path: 'onboarding',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile-face-scan'
      },
      {
        path: 'profile-face-scan',
        canLoad: [HasNotCompletedOnboardingGuard, HasNotCompletedProfileFaceScanGuard],
        data: {
          hasCompletedOnboardingRedirect: 'walk-through',
          hasCompletedProfileFaceScanRedirect: '/onboarding/profile-details'
        },
        loadChildren: () => import('./onboarding/profile-face-scan/profile-face-scan.module').then(m => m.ProfileFaceScanPageModule)
      },
      {
        path: 'profile-details',
        canLoad: [HasNotCompletedOnboardingGuard, HasCompletedProfileFaceScanGuard, HasNotCompletedProfileDetailsGuard],
        data: {
          hasCompletedOnboardingRedirect: 'walk-through',
          hasCompletedProfileDetailsRedirect: '/walk-through'
        },
        loadChildren: () => import('./onboarding/profile-details/profile-details.module').then(m => m.ProfileDetailsPageModule)
      },
    ]
  },
  {
    path: 'walk-through',
    canLoad: [HasNotCompletedWalkthroughGuard],
    data: {hasCompletedWalkthroughRedirect: '/home'},
    loadChildren: () => import('./walk-through/walkthrough.module').then(m => m.WalkthroughPageModule)
  },
  {
    path: 'home',
    canLoad: [HasCompletedOnboardingGuard, HasCompletedWalkthroughGuard],
    loadChildren: () => import('./home/tabs/tabs.module').then(m => m.TabsPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
