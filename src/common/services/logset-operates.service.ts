import { Injectable } from '@angular/core';

import { LogsetOperate } from '@common/models/logset-operate';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class LogsetOperatesService extends WpxApi<LogsetOperate> {
  protected override collection = 'logset_operates';
}
