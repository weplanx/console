import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, R, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-integrated-extend-email',
  templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {
  form: FormGroup = this.fb.group({
    EmailHost: [null, [Validators.required]],
    EmailPort: [null, [Validators.required]],
    EmailUsername: [null, [Validators.required]],
    EmailPassword: [null, [Validators.required]]
  });
  tips = {
    EmailUsername: {
      default: {
        required: `Username cannot be empty`
      }
    },
    EmailPassword: {
      default: {
        required: `Password cannot be empty`
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
      EmailHost: this.data['EmailHost'],
      EmailPort: this.data['EmailPort'],
      EmailUsername: this.data['EmailUsername']
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
