import { Pipe, PipeTransform } from '@angular/core';

import { WpxService } from '../wpx.service';

@Pipe({
  standalone: true,
  name: 'wpxAssets'
})
export class WpxAssetsPipe implements PipeTransform {
  constructor(private wpx: WpxService) {}

  transform(values: string[], query?: string, css?: boolean): string {
    if (values.length === 0) {
      return '';
    }
    let url = [this.wpx.assets, ...values].join('/');
    if (query) {
      if (url.includes('?')) {
        url += query;
      } else {
        url = `${url}?${query}`;
      }
    }
    return !css ? url : `url("${url}")`;
  }
}
