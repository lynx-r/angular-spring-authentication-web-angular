import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundPageComponent} from './containers/not-found-page';
import {LandingComponent} from './components/landing.component';
import {AuthModule} from '../auth/auth.module';
import {SigninPageComponent} from '../auth/containers/signin-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'auth',
    // component: SigninPageComponent
    loadChildren: 'app/auth/auth.module#AuthModule',
  },
  {path: '**', component: NotFoundPageComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class CoreRoutingModule {
}
