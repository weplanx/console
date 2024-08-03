import { Component, Input } from '@angular/core';

import { Metrics } from '@common/models/imessage';
import { ShareModule } from '@common/share.module';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-imessages-detail-count-rate',
  template: `
    <ng-template #loadRef>-<nz-divider nzType="vertical"></nz-divider>-/s</ng-template>
    <ng-container *ngIf="metric; else loadRef">
      {{ metric[count] | nzSafeNull }}
      <nz-divider nzType="vertical"></nz-divider>
      {{ metric[rate] | nzSafeNull | number: '1.4-4' }}/s
    </ng-container>
  `
})
export class CountRateComponent {
  @Input({ required: true }) metric?: Metrics;
  @Input({ required: true }) count!: keyof Metrics;
  @Input({ required: true }) rate!: keyof Metrics;
}
