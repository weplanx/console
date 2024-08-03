import { Component, OnInit, Type } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService, WpxStoreService } from '@weplanx/ng';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalService } from 'ng-zorro-antd/modal';

import { IpListComponent, IpListData } from './ip-list/ip-list.component';
import { IpLockComponent } from './ip-lock/ip-lock.component';
import { PwdStrategyComponent } from './pwd-strategy/pwd-strategy.component';
import { PwdTtlComponent } from './pwd-ttl/pwd-ttl.component';
import { SessionComponent } from './session/session.component';
import { UserLockComponent } from './user-lock/user-lock.component';

@Component({
  standalone: true,
  imports: [
    ShareModule,
    NzAlertModule,
    IpListComponent,
    IpLockComponent,
    PwdStrategyComponent,
    PwdTtlComponent,
    SessionComponent,
    UserLockComponent
  ],
  selector: 'app-admin-settings-security',
  templateUrl: './security.component.html'
})
export class SecurityComponent implements OnInit {
  tabIndex = 0;
  data: R = {};

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private store: WpxStoreService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  saveTabIndex(): void {
    this.store.set<number>('admin-security', this.tabIndex).subscribe();
  }

  getData(): void {
    this.store.get<number>('admin-security').subscribe(v => {
      if (v) {
        this.tabIndex = v;
      }
    });
    this.wpx
      .getValues([
        'SessionTTL',
        'LoginTTL',
        'LoginFailures',
        'IpLoginFailures',
        'IpWhitelist',
        'IpBlacklist',
        'PwdStrategy',
        'PwdTTL'
      ])
      .subscribe(data => {
        this.data = data;
      });
  }

  private setModal(component: Type<Any>): void {
    this.modal.create<Type<Any>, R>({
      nzTitle: `Security Modify`,
      nzContent: component,
      nzData: this.data,
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  setSession(): void {
    this.setModal(SessionComponent);
  }

  setUserLock(): void {
    this.setModal(UserLockComponent);
  }

  setIpLock(): void {
    this.setModal(IpLockComponent);
  }

  setPwdStrategy(): void {
    this.setModal(PwdStrategyComponent);
  }

  setPwdTtl(): void {
    this.setModal(PwdTtlComponent);
  }

  setIpList(type: 'IpWhitelist' | 'IpBlacklist'): void {
    const name = type === 'IpWhitelist' ? `Whitelist` : `Blacklist`;
    this.modal.create<IpListComponent, IpListData>({
      nzTitle: `${name}`,
      nzContent: IpListComponent,
      nzData: {
        type,
        ip: this.data[type]
      },
      nzOnOk: () => {
        this.getData();
      }
    });
  }
}
