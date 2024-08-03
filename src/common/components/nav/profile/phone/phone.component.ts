import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-nav-profile-phone',
  templateUrl: './phone.component.html'
})
export class PhoneComponent {
  form: FormGroup = this.fb.group({
    area: ['+86', [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/[0-9]{11}/)]],
    code: [null, [Validators.required, Validators.pattern(/[0-9]{6}/)]]
  });
  tips = {
    phone: {
      default: {
        required: `Phone Number cannot be empty`,
        pattern: `Must be in phone number format`
      }
    },
    code: {
      default: {
        required: `Code cannot be empty`,
        pattern: `Must be a number of length 6`
      }
    }
  };
  timer = 0;
  private timeId?: Any;

  constructor(
    private app: AppService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  getCode(): void {
    const phone = this.form.get('area')!.value + this.form.get('phone')!.value;
    this.timer = 60;
    this.app.getUserPhoneCode(phone).subscribe(() => {
      this.timeId = setInterval(() => {
        if (!this.timer) {
          clearInterval(this.timeId);
          return;
        }
        this.timer--;
      }, 1000);
    });
  }

  close(): void {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.app.setUserPhone(data.area + data.phone, data.code).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
