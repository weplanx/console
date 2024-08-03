import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { WpxService } from '@weplanx/ng';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TranslationComponent {
  @Input() simple = false;

  constructor(
    public wpx: WpxService,
    @Inject(LOCALE_ID) public locale: string
  ) {}
}
