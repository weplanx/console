import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AppService } from '@app';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { WpxUploadAvatarComponent } from '@weplanx/ng/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule, WpxUploadAvatarComponent],
  selector: 'app-nav-profile-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent implements OnInit {
  form: FormGroup = this.fb.group({
    avatar: [null]
  });

  constructor(
    private app: AppService,
    private modalRef: NzModalRef,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.app.user()!);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.app.setUser({ key: 'avatar', avatar: data.avatar }).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
