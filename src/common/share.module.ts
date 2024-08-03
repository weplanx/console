import { NgOptimizedImage } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WpxModule } from '@weplanx/ng';
import { WpxCheckboxComponent } from '@weplanx/ng/checkbox';
import { WpxKeywordComponent } from '@weplanx/ng/keyword';
import { WpxTableComponent } from '@weplanx/ng/table';
import { WpxToolboxComponent } from '@weplanx/ng/toolbox';

@NgModule({
  exports: [
    RouterModule,
    NgOptimizedImage,
    WpxModule,
    WpxKeywordComponent,
    WpxToolboxComponent,
    WpxTableComponent,
    WpxCheckboxComponent
  ],
  imports: [NgOptimizedImage, WpxCheckboxComponent, WpxKeywordComponent, WpxToolboxComponent, WpxTableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareModule {}
