import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-integrated-extend-sms',
  templateUrl: './sms.component.html'
})
export class SmsComponent implements OnInit {
  form: FormGroup = this.fb.group({
    SmsSecretId: [null, [Validators.required]],
    SmsSecretKey: [null, [Validators.required]],
    SmsSign: [null, [Validators.required]],
    SmsAppId: [null, [Validators.required]],
    SmsRegion: ['ap-guangzhou', [Validators.required]]
  });
  tips = {
    SmsSecretId: {
      default: {
        required: `Secret Id cannot be empty`
      }
    },
    SmsSecretKey: {
      default: {
        required: `Secret Key cannot be empty`
      }
    },
    SmsSign: {
      default: {
        required: `Sign cannot be empty`
      }
    },
    SmsAppId: {
      default: {
        required: `App Id cannot be empty`
      }
    },
    SmsRegion: {
      default: {
        required: `Region cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: R,
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form.patchValue({
      SmsSecretId: this.data['SmsSecretId'],
      SmsSign: this.data['SmsSign'],
      SmsAppId: this.data['SmsAppId'],
      SmsRegion: this.data['SmsRegion']
    });
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.wpx.setValues(data).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
