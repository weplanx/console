import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-acc-tasks-setting',
  templateUrl: './setting.component.html'
})
export class SettingComponent implements OnInit {
  form: FormGroup = this.fb.group({
    AccelerateAddress: ['', [Validators.required]],
    CamUin: ['', [Validators.required]]
  });
  tips = {
    AccelerateAddress: {
      default: {
        required: `Accelerate Address cannot be empty`
      }
    },
    CamUin: {
      default: {
        required: `Cam Uin cannot be empty`
      }
    }
  };

  constructor(
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private wpx: WpxService
  ) {}

  ngOnInit(): void {
    this.wpx.getValues(['AccelerateAddress', 'CamUin']).subscribe(data => {
      this.form.patchValue(data);
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
