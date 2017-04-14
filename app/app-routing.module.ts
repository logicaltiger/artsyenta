import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AuthGuard } from './auth-guard.service';
import { AuthProviderGuard } from './auth-provider-guard.service';
import { AuthServiceGuard } from './auth-service-guard.service';
import { PreloadSelectedModules } from './selective-preload-strategy';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: 'app/admin/admin.module#AdminModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'provider',
    loadChildren: 'app/provider/provider.module#ProviderModule',
    canLoad: [AuthProviderGuard]
  },
  {
    path: 'service',
    loadChildren: 'app/service/service.module#ServiceModule',
    canLoad: [AuthServiceGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { preloadingStrategy: PreloadSelectedModules }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CanDeactivateGuard,
    PreloadSelectedModules
  ]
})
export class AppRoutingModule {}
