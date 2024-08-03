import { Component } from '@angular/core';

import { AppService } from '@app';
import { NavComponent } from '@common/components/nav/nav.component';
import { ShareModule } from '@common/share.module';

@Component({
  standalone: true,
  imports: [ShareModule, NavComponent],
  selector: 'app-audit',
  template: `
    <nz-layout style="height: 100%">
      <nz-header class="nav">
        <app-nav>
          <ul nz-menu nzMode="horizontal" style="line-height: 63px">
            <li nz-menu-item nzMatchRouter routerLink="logins">
              <span nz-icon nzType="login" nzTheme="outline"></span>
              Logins
            </li>
            <li nz-menu-item nzMatchRouter routerLink="operates">
              <span nz-icon nzType="history" nzTheme="outline"></span>
              Operates
            </li>
          </ul>
        </app-nav>
      </nz-header>
      <nz-layout style="overflow: hidden auto">
        <nz-content style="padding: 8px">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `
})
export class AuditComponent {
  constructor(public app: AppService) {}
}
