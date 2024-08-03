import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';

@Component({
  standalone: true,
  imports: [ShareModule, NzQRCodeModule],
  selector: 'app-nav-profile-totp',
  templateUrl: './totp.component.html'
})
export class TotpComponent implements OnInit {
  form: FormGroup = this.fb.group({
    ts1: [null, [Validators.required, Validators.pattern(/[0-9]{6}/)]],
    ts2: [null, [Validators.required, Validators.pattern(/[0-9]{6}/)]]
  });
  status: 'active' | 'expired' | 'loading' = 'loading';
  totp: string = '';

  private timeId?: Any;

  constructor(
    private app: AppService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getTotp();
  }

  getTotp(): void {
    this.status = 'loading';
    this.app.getTotp().subscribe(data => {
      this.timeId = setTimeout(() => {
        this.status = 'expired';
      }, 299 * 1000);

      this.totp = data['totp'];
      this.status = 'active';
    });
  }

  close(): void {
    if (this.timeId) {
      clearTimeout(this.timeId);
    }
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.app.setUserTotp(this.totp!, [data.ts1, data.ts2]).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
