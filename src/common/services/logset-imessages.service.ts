import { Injectable } from '@angular/core';

import { LogsetImessage } from '@common/models/logset-imessage';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class LogsetImessagesService extends WpxApi<LogsetImessage> {
  protected override collection = 'logset_imessages';
}
