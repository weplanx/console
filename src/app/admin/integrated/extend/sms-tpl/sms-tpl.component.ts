import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface SmsTplInput {
  key: string;
  value: string;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-integrated-extend-sms-tpl',
  templateUrl: './sms-tpl.component.html'
})
export class SmsTplComponent implements OnInit {
  form!: FormGroup;
  tips = {
    value: {
      default: {
        required: `Template ID cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: SmsTplInput,
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      [this.data.key]: [this.data.value, [Validators.required]]
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
