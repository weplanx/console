import { Injectable } from '@angular/core';

import { WpxApi } from '@weplanx/ng';
import { WpxPicture } from '@weplanx/ng/filebrowser';

@Injectable({ providedIn: 'root' })
export class PicturesService extends WpxApi<WpxPicture> {
  protected override collection = 'pictures';
}
