import { Component, OnInit } from '@angular/core';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  standalone: true,
  imports: [ShareModule, NzResultModule],
  selector: 'app-result-authorized',
  template: `
    <nz-result
      nzStatus="success"
      nzTitle="Authorization successful"
      nzSubTitle="You have successfully linked your Lark account"
    >
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="close()">关闭</button>
      </div>
    </nz-result>
  `
})
export class AuthorizedComponent implements OnInit {
  constructor(private app: AppService) {}

  ngOnInit(): void {
    console.log(this.app.user);
  }

  close(): void {
    this.app.getUser().subscribe(() => {
      window.close();
    });
  }
}
