import { Platform } from '@angular/cdk/platform';
import { Component } from '@angular/core';

import { TranslationComponent } from '@common/components/translation/translation.component';
import { ShareModule } from '@common/share.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  standalone: true,
  imports: [ShareModule, NzLayoutModule, TranslationComponent],
  selector: 'app-blank-page',
  templateUrl: './blank-page.component.html',
  styleUrl: './blank-page.component.css'
})
export class BlankPageComponent {
  constructor(private platform: Platform) {}

  star(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    window.open('https://github.com/weplanx', '_blank');
  }
}
