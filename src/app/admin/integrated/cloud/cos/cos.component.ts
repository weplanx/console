import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-integrated-cloud-cos',
  templateUrl: './cos.component.html'
})
export class CosComponent implements OnInit {
  form: FormGroup = this.fb.group({
    TencentCosBucket: [null, [Validators.required]],
    TencentCosRegion: [null, [Validators.required]],
    TencentCosExpired: [null, [Validators.required]],
    TencentCosLimit: [null, [Validators.required]]
  });
  tips = {
    TencentCosBucket: {
      default: {
        required: `Bucket Name cannot be empty`
      }
    },
    TencentCosRegion: {
      default: {
        required: `Region cannot be empty`
      }
    },
    TencentCosExpired: {
      default: {
        required: `Pre-signature Expired cannot be empty`
      }
    },
    TencentCosLimit: {
      default: {
        required: `Upload Size cannot be empty`
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
    const data = { ...this.data };
    this.form.patchValue(data);
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
