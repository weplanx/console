import { Injectable } from '@angular/core';

import { LogsetLogin } from '@common/models/logset-login';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class LogsetLoginsService extends WpxApi<LogsetLogin> {
  protected override collection = 'logset_logins';
}
