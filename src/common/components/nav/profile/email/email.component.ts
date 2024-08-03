import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AppService } from '@app';
import { UsersService } from '@common/services/users.service';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-nav-profile-email',
  templateUrl: './email.component.html'
})
export class EmailComponent implements OnInit {
  existsEmail = (control: AbstractControl): Observable<Any> => {
    if (control.value === this.app.user()!.email) {
      return of(null);
    }
    return this.users.existsEmail(control.value);
  };
  form: FormGroup = this.fb.group({
    email: [null, [Validators.email], [this.existsEmail]]
  });
  tips = {
    email: {
      default: {
        required: `Email cannot be empty`,
        email: `Must be in email format`
      }
    }
  };

  constructor(
    private app: AppService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private users: UsersService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.app.user()!);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.app.setUser({ key: 'email', email: data.email }).subscribe(() => {
      this.message.success(`Update successful, you need to sign in again`);
      this.modalRef.triggerOk();
    });
  }
}
