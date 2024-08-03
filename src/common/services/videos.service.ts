import { Injectable } from '@angular/core';

import { WpxApi } from '@weplanx/ng';
import { WpxFile } from '@weplanx/ng/filebrowser';

@Injectable({ providedIn: 'root' })
export class VideosService extends WpxApi<WpxFile> {
  protected override collection = 'videos';
}
