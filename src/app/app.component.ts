import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@env';
import { WpxService } from '@weplanx/common';
import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private wpx: WpxService, private router: Router, private nzIconService: NzIconService) {}

  ngOnInit(): void {
    this.wpx.setAssets(environment.cdn);
    this.wpx.setUpload({
      url: environment.upload.url,
      presignedUrl: environment.upload.presignedUrl,
      size: environment.upload.size
    });
    this.wpx.onLogout = () => {
      this.router.navigateByUrl('/login');
    };
    this.nzIconService.changeAssetsSource(environment.cdn);
  }
}
