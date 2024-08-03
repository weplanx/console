import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, WpxService } from '@weplanx/ng';
import { JoinedEditorOptions, NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { KeyValue } from '../types';

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'app-admin-settings-values-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    key: [null, [Validators.required]],
    value: [null, [Validators.required]]
  });
  tips = {
    key: {
      default: {
        required: `Key cannot be empty`
      }
    },
    value: {
      default: {
        required: `Value cannot be empty`
      }
    }
  };
  option: JoinedEditorOptions = { language: 'json' };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: KeyValue,
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  get key(): string {
    return this.form.get('key')?.value;
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    switch (this.key) {
      case 'RestControls':
        data.value = JSON.parse(data.value);
        break;
    }
    this.wpx.setValues({ [data.key]: data.value }).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
