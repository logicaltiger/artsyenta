import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthProviderGuard } from '../auth-provider-guard.service';
import { AuthServiceGuard } from '../auth-service-guard.service';
import { AuthGuard } from '../auth-guard.service';
import { LoginComponent } from './login.component';

const loginRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthProviderGuard,
    AuthServiceGuard,
    AuthGuard
  ]
})
export class LoginRoutingModule {}
