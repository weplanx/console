import { Component, OnInit, Type } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService, WpxStoreService } from '@weplanx/ng';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { CosComponent } from './cos/cos.component';
import { TencentComponent } from './tencent/tencent.component';

@Component({
  standalone: true,
  imports: [ShareModule, NzEmptyModule, CosComponent, TencentComponent],
  selector: 'app-admin-integrated-cloud',
  templateUrl: './cloud.component.html'
})
export class CloudComponent implements OnInit {
  tabIndex = 0;
  values: R = {};

  constructor(
    private wpx: WpxService,
    private store: WpxStoreService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.store.get<number>('admin-cloud-tab').subscribe(v => {
      if (v) {
        this.tabIndex = v;
      }
    });
    this.getData();
  }

  saveTabIndex(): void {
    this.store.set<number>('admin-cloud-tab', this.tabIndex).subscribe();
  }

  getData(): void {
    this.wpx
      .getValues([
        'Cloud',
        'TencentSecretId',
        'TencentSecretKey',
        'TencentCosBucket',
        'TencentCosRegion',
        'TencentCosExpired',
        'TencentCosLimit'
      ])
      .subscribe(data => {
        this.values = data;
      });
  }

  private setModal(nzTitle: string, component: Type<Any>): void {
    this.modal.create<Type<Any>, Record<string, Any>>({
      nzTitle,
      nzContent: component,
      nzData: this.values,
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  useCloud(platform: string): void {
    let message = `您确定使用这个服务商吗？`;
    if (this.values['Cloud']) {
      if (platform === this.values['Cloud']) {
        message = `您确定要停用他吗?`;
        platform = '';
      } else {
        message = `已经存在一个服务商，开启他将关闭之前存在的！`;
      }
    }
    this.modal.confirm({
      nzTitle: `公有云设置`,
      nzContent: message,
      nzMaskClosable: true,
      nzOnOk: () => {
        this.wpx.setValues({ Cloud: platform }).subscribe(() => {
          this.getData();
          this.message.success(`数据更新成功`);
        });
      }
    });
  }

  setTencent(): void {
    this.setModal(`腾讯云设置`, TencentComponent);
  }

  setCos(): void {
    this.setModal(`腾讯云 COS 设置`, CosComponent);
  }
}
