import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LyCoreModule } from 'alyle-ui/core';
import { LyTabsModule } from 'alyle-ui/tabs';
import { LyToolbarModule } from 'alyle-ui/toolbar';
import { LyIconButtonModule } from 'alyle-ui/icon-button';
import { LySvgModule } from 'alyle-ui/svg';
import { LyShadowModule } from 'alyle-ui/shadow';

import { PrismModule } from '../core/prism/prism.module';

import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [
    CommonModule,
    PrismModule,
    LyTabsModule,
    LyShadowModule,
    LyToolbarModule,
    LyIconButtonModule,
    LySvgModule,
    LyCoreModule
  ],
  exports: [ViewComponent],
  declarations: [ViewComponent]
})
export class DemoViewModule { }