import { Component, OnInit, Type } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzModalService } from 'ng-zorro-antd/modal';

import { LarkComponent } from './lark/lark.component';
import { RedirectComponent } from './redirect/redirect.component';

@Component({
  standalone: true,
  imports: [ShareModule, LarkComponent, RedirectComponent],
  selector: 'app-admin-integrated-collaboration',
  templateUrl: './collaboration.component.html'
})
export class CollaborationComponent implements OnInit {
  data: R = {};

  constructor(
    private wpx: WpxService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.wpx
      .getValues(['LarkAppId', 'LarkAppSecret', 'LarkEncryptKey', 'LarkVerificationToken', 'RedirectUrl'])
      .subscribe(data => {
        this.data = data;
      });
  }

  private setModal(nzTitle: string, component: Type<Any>): void {
    this.modal.create<Type<Any>, Record<string, Any>>({
      nzTitle,
      nzContent: component,
      nzData: this.data,
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  setLark(): void {
    this.setModal(`Lark`, LarkComponent);
  }

  setRedirect(): void {
    this.setModal(`Third-party Login`, RedirectComponent);
  }
}
