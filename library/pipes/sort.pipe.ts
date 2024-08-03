import { Pipe, PipeTransform } from '@angular/core';

import { Any } from '../types';

@Pipe({
  standalone: true,
  name: 'wpxSort'
})
export class WpxSortPipe implements PipeTransform {
  transform(value: Any[], field: string, sort: 1 | -1 = 1): Any[] {
    return value.sort((a, b) => {
      if (a[field] && b[field]) {
        return (a[field] - b[field]) * sort;
      }
      return 0;
    });
  }
}
