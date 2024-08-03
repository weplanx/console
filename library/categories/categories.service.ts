import { Injectable } from '@angular/core';

import { WpxApi } from '@weplanx/ng';

import { WpxCategory } from './types';

@Injectable({ providedIn: 'root' })
export class WpxCategoriesService extends WpxApi<WpxCategory> {
  protected override collection = 'categories';
}
