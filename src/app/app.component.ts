import { Component, OnInit } from '@angular/core';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { environment } from '@env';
import { WpxService } from '@weplanx/ng';
import { NzIconService } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  standalone: true,
  imports: [ShareModule, NzSpinModule],
  selector: 'app-root',
  template: `
    @defer {
      <router-outlet></router-outlet>
    }
  `
})
export class AppComponent implements OnInit {
  constructor(
    private app: AppService,
    private wpx: WpxService,
    private icon: NzIconService
  ) {}

  ngOnInit(): void {
    this.app.ping().subscribe();
    this.icon.changeAssetsSource(environment.cdn);
    this.wpx.setAssets(environment.cdn);
    this.wpx.loadScript('cropperjs', `${environment.cdn}/npm/cropperjs@1.6.0/dist/cropper.min.js`, []);
    this.wpx.loadScript('editorjs', `${environment.cdn}/npm/@editorjs/editorjs@2.27.2/dist/editorjs.umd.min.js`, [
      `${environment.cdn}/npm/@editorjs/paragraph@2.10.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/header@2.7.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/delimiter@1.3.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/underline@1.1.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/nested-list@1.3.0/dist/nested-list.min.js`,
      `${environment.cdn}/npm/@editorjs/checklist@1.5.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/table@2.2.2/dist/table.min.js`,
      `${environment.cdn}/npm/@editorjs/quote@2.5.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/code@2.8.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/marker@1.3.0/dist/bundle.min.js`,
      `${environment.cdn}/npm/@editorjs/inline-code@1.4.0/dist/bundle.min.js`
    ]);
    this.app.getUploadOption().subscribe(v => {
      this.wpx.setUpload(v);
    });
  }
}
