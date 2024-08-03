import { Pipe, PipeTransform } from '@angular/core';

import { Any } from '../types';

@Pipe({
  standalone: true,
  name: 'wpxObject'
})
export class WpxObjectPipe implements PipeTransform {
  transform(value: string): Any {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {};
    }
  }
}
