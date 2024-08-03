import { Component, Inject } from '@angular/core';

import { WpxModule } from '@weplanx/ng';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

export interface VideoInput {
  url: string;
}

@Component({
  standalone: true,
  imports: [WpxModule],
  selector: 'wpx-media-video',
  template: `
    <video style="width: 100%" controls [poster]="[data.url + '_0'] | wpxAssets">
      <source [src]="[data.url] | wpxAssets" />
      <p>
        Your browser does not support HTML5 video. Please click
        <a [href]="[data.url] | wpxAssets">video link</a>.
      </p>
    </video>
  `
})
export class VideoComponent {
  constructor(@Inject(NZ_MODAL_DATA) public data: VideoInput) {}
}
