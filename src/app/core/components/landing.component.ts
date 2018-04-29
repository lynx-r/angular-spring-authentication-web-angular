import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-landing',
  template: `
    <div>
      <a routerLink="/auth/SignUp">Зарегистрироваться</a>
    </div>
    <div>
      <a routerLink="/auth/SignIn">Войти</a>
    </div>
  `,
  styles: [`

  `]
})
export class LandingComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
  }

}
