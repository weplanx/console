import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-imessage-emqx-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    EmqxHost: [null, [Validators.required]],
    EmqxApiKey: [null, [Validators.required]],
    EmqxSecretKey: [null, [Validators.required]]
  });
  tips = {
    EmqxHost: {
      default: {
        required: `EMQX Host cannot be empty`
      }
    },
    EmqxApiKey: {
      default: {
        required: `EMQX ApiKey cannot be empty`
      }
    },
    EmqxSecretKey: {
      default: {
        required: `EMQX SecretKey cannot be empty`
      }
    }
  };

  constructor(
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.wpx.getValues(['EmqxHost', 'EmqxApiKey']).subscribe(data => {
      this.form.patchValue({
        EmqxHost: data['EmqxHost'],
        EmqxApiKey: data['EmqxApiKey']
      });
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
