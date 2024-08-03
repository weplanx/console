import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { BlankPageComponent } from '@common/components/page/blank-page.component';
import { ShareModule } from '@common/share.module';
import { Any, validates } from '@weplanx/ng';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  standalone: true,
  imports: [ShareModule, NzResultModule, NzStepsModule, BlankPageComponent],
  selector: 'app-forget',
  templateUrl: './forget.component.html'
})
export class ForgetComponent {
  index = 0;
  verifyForm: FormGroup = this.fb.group({
    email: [null, [Validators.required, Validators.email]],
    code: [null, [Validators.required, Validators.pattern(/[0-9]{6}/)]]
  });
  validedPassword = (control: AbstractControl): Any => {
    if (!control.value) {
      return;
    }
    control.parent?.get('check')!.updateValueAndValidity();
    return validates.password(control.value);
  };
  checkPassword = (control: AbstractControl): Any => {
    if (!control.value) {
      return;
    }
    if (control.value !== control.parent?.get('password')!.value) {
      return { inconsistent: true, error: true };
    }
    return null;
  };
  resetForm: FormGroup = this.fb.group({
    password: [null, [Validators.required, this.validedPassword]],
    check: [null, [Validators.required, this.checkPassword]]
  });
  tips = {
    email: {
      default: {
        required: `Email cannot be empty`,
        email: `Must be in email format`
      }
    },
    code: {
      default: {
        required: `Code cannot be empty`,
        pattern: `Must be a number of length 6`
      }
    },
    password: {
      default: {
        required: `Password cannot be empty`,
        minlength: `The password length must be greater than 8`,
        lowercase: `The password needs to contain lowercase letters`,
        uppercase: `The password needs to contain uppercase letters`,
        number: `The password needs to contain numbers`,
        symbol: `The password needs to contain symbols (@$!%*?&-+)`,
        inconsistent: `The password confirmed again is inconsistent`
      }
    }
  };

  emailTimer = 0;
  private emailTimeId?: Any;
  private verifyData?: Any;

  constructor(
    private app: AppService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  getForgetCode(): void {
    this.emailTimer = 900;
    this.app.getForgetCode(this.verifyForm.get('email')!.value).subscribe(() => {
      this.emailTimeId = setInterval(() => {
        if (!this.emailTimer) {
          clearInterval(this.emailTimeId);
          return;
        }
        this.emailTimer--;
      }, 1000);
    });
  }

  verifySubmit(data: Any): void {
    this.index++;
    this.verifyData = data;
  }

  previous(): void {
    this.index--;
    this.cdr.detectChanges();
  }

  resetSubmit(data: Any): void {
    this.app.forgetReset(this.verifyData.email, this.verifyData.code, data.password).subscribe(() => {
      this.index++;
    });
  }
}
