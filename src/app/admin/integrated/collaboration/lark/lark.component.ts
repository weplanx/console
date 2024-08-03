import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-integrated-collaboration-lark',
  templateUrl: './lark.component.html'
})
export class LarkComponent implements OnInit {
  form: FormGroup = this.fb.group({
    LarkAppId: [null, [Validators.required]],
    LarkAppSecret: [null, [Validators.required]],
    LarkEncryptKey: [null, [Validators.required]],
    LarkVerificationToken: [null, [Validators.required]]
  });
  tips = {
    LarkAppId: {
      default: {
        required: `Lark App ID cannot be empty`
      }
    },
    LarkAppSecret: {
      default: {
        required: `Lark App Secret cannot be empty`
      }
    },
    LarkEncryptKey: {
      default: {
        required: `Lark Encrypt Key cannot be empty`
      }
    },
    LarkVerificationToken: {
      default: {
        required: `Lark Verification Token cannot be empty`
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
      LarkAppId: this.data['LarkAppId']
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
