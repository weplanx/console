import { Component } from '@angular/core';

import { PicturesService } from '@common/services/pictures.service';
import { ShareModule } from '@common/share.module';
import { WpxFilebrowserComponent } from '@weplanx/ng/filebrowser';

@Component({
  standalone: true,
  imports: [ShareModule, WpxFilebrowserComponent],
  selector: 'app-filebrowser-pictures',
  template: `
    <wpx-filebrowser
      [wpxApi]="pictures"
      [wpxType]="'picture'"
      [wpxFallback]="['assets', 'photon.svg'] | wpxAssets"
    ></wpx-filebrowser>
  `
})
export class PicturesComponent {
  constructor(public pictures: PicturesService) {}
}
