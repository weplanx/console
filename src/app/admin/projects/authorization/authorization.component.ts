import { Component, Inject } from '@angular/core';

import { Project } from '@common/models/project';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-projects-authorization',
  templateUrl: './authorization.component.html'
})
export class AuthorizationComponent {
  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: AnyDto<Project>
  ) {}
}
