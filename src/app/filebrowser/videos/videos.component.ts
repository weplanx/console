import { Component } from '@angular/core';

import { VideosService } from '@common/services/videos.service';
import { ShareModule } from '@common/share.module';
import { WpxFilebrowserModule } from '@weplanx/ng/filebrowser';

@Component({
  standalone: true,
  imports: [ShareModule, WpxFilebrowserModule],
  selector: 'app-filebrowser-videos',
  template: `
    <wpx-filebrowser
      [wpxApi]="videos"
      [wpxType]="'video'"
      [wpxFallback]="['assets', 'photon.svg'] | wpxAssets"
    ></wpx-filebrowser>
  `
})
export class VideosComponent {
  constructor(public videos: VideosService) {}
}
