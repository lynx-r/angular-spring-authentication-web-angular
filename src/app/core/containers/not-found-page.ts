import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'bc-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>404: Страница не найдена</div>
  `,
  styles: [
      `
      :host {
        text-align: center;
      }
    `,
  ],
})
export class NotFoundPageComponent {
}
