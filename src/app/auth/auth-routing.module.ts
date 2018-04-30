import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {SigninPageComponent} from './containers/signin-page.component';
import {SignupPageComponent} from './containers/signup-page.component';

const routes: Routes = [
  {path: 'SignIn', component: SigninPageComponent},
  {path: 'SignUp', component: SignupPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class AuthRoutingModule {
}
