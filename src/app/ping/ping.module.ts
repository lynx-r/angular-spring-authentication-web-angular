import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PingComponent } from './ping/ping.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {PingEffects} from './effects/ping.effects';
import {reducers} from './reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('ping', reducers),
    EffectsModule.forFeature([PingEffects]),
  ],
  declarations: [PingComponent],
  exports: [PingComponent]
})
export class PingModule { }
