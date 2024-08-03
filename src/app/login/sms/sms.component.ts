import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-login-sms',
  templateUrl: './sms.component.html'
})
export class SmsComponent implements OnDestroy {
  form: FormGroup = this.fb.group({
    area: ['+86', [Validators.required]],
    phone: [null, [Validators.required, Validators.pattern(/[0-9]{11}/)]],
    code: [null, [Validators.required, Validators.pattern(/[0-9]{6}/)]]
  });
  loading = false;
  tips = {
    phone: {
      default: {
        required: `Phone number cannot be empty`,
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
    private fb: FormBuilder,
    private router: Router,
    private notification: NzNotificationService
  ) {}

  ngOnDestroy(): void {
    if (this.timeId) {
      clearInterval(this.timeId);
    }
  }

  getCode(): void {
    const phone = this.form.get('area')!.value + this.form.get('phone')!.value;
    this.timer = 60;
    this.app.getLoginSms(phone).subscribe(() => {
      this.timeId = setInterval(() => {
        if (!this.timer) {
          clearInterval(this.timeId);
          return;
        }
        this.timer--;
      }, 1000);
    });
  }

  submit(data: Any): void {
    this.loading = true;
    this.app.loginSms(data.area + data.phone, data.code).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/');
        this.notification.success(`Authentication Status`, `🚀Login successful, loading data...`);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
