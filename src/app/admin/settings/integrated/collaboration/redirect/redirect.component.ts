import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin-integrated-collaboration-redirect',
  templateUrl: './redirect.component.html'
})
export class RedirectComponent implements OnInit {
  tips = {
    redirect_url: {
      default: {
        required: $localize`The redirect url cannot be empty`
      }
    }
  };
  @Input() values!: Record<string, any>;
  form!: FormGroup;

  constructor(
    public wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      redirect_url: [null, [Validators.required]]
    });
    this.form.patchValue(this.values);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: any): void {
    this.wpx.setValues(data).subscribe(() => {
      this.message.success($localize`Data update complete`);
      this.modalRef.triggerOk();
    });
  }
}