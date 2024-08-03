import { Injectable } from '@angular/core';

import { LogsetJob } from '@common/models/logset-job';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class LogsetJobsService extends WpxApi<LogsetJob> {
  protected override collection = 'logset_jobs';
}
