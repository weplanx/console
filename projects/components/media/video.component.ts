import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { WpxMedia } from './media';

@Component({
  selector: 'wpx-media-video',
  templateUrl: './video.component.html',
  styleUrls: ['./media.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WpxMediaVideoComponent),
      multi: true
    }
  ]
})
export class WpxMediaVideoComponent extends WpxMedia {}