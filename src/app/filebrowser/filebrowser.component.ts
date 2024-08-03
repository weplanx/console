import { Component } from '@angular/core';

import { NavComponent } from '@common/components/nav/nav.component';
import { ShareModule } from '@common/share.module';

@Component({
  standalone: true,
  imports: [ShareModule, NavComponent],
  selector: 'app-filebrowser',
  template: `
    <nz-layout style="height: 100%">
      <nz-header class="nav">
        <app-nav>
          <ul nz-menu nzMode="horizontal" style="line-height: 47px">
            <li nz-menu-item nzMatchRouter routerLink="pictures">
              <span nz-icon nzType="picture" nzTheme="outline"></span>
              Picture
            </li>
            <li nz-menu-item nzMatchRouter routerLink="videos">
              <span nz-icon nzType="video-camera" nzTheme="outline"></span>
              Video
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
export class FilebrowserComponent {}
