import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { LoadOption } from '@weplanx/ng';

export const OPTION = new InjectionToken<Option>('store.option');
export interface Option extends LoadOption {
  name: string;
}