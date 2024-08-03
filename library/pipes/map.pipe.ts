import { Pipe, PipeTransform } from '@angular/core';

import { Any } from '../types';

@Pipe({
  standalone: true,
  name: 'wpxMap'
})
export class WpxMapPipe implements PipeTransform {
  transform(value: Map<Any, Any>, key: Any): Any {
    return value.get(key);
  }
}
