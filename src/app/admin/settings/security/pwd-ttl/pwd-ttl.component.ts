import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-settings-security-pwd-ttl',
  templateUrl: './pwd-ttl.component.html'
})
export class PwdTtlComponent implements OnInit {
  form: FormGroup = this.fb.group({
    PwdTTL: [0, [Validators.required]]
  });
  tips = {
    pwd_ttl: {
      default: {
        required: `Expired cannot be empty`
      }
    }
  };
  formatterTimes = (value: number): string => `${value} days`;

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: R,
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const data = {
      PwdTTL: this.data['PwdTTL'] / 86400e9
    };
    this.form.patchValue(data);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    data.PwdTTL = data.PwdTTL * 86400e9;
    this.wpx.setValues(data).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
