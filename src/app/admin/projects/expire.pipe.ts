import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

import { Project } from '@common/models/project';
import { AnyDto } from '@weplanx/ng';

@Pipe({
  standalone: true,
  name: 'expire'
})
export class ExpirePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(v: AnyDto<Project>): string {
    if (!v.status) {
      return 'Disabled';
    }
    return !v.expire ? 'Long' : 'Expires ' + formatDate(v.expire, 'yyyy/MM/dd', this.locale);
  }
}
