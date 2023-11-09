import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { QueuesService } from '@common/services/queues.service';
import { Any } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface PublishInput {
  subject?: string;
}

@Component({
  selector: 'app-index-queues-publish',
  templateUrl: './publish.component.html'
})
export class PublishComponent implements OnInit {
  form!: FormGroup;
  tips = {
    subject: {
      default: {
        required: `Subject cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: PublishInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private queues: QueuesService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      subject: ['', [Validators.required]],
      payload: ['', [Validators.required]]
    });
    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.queues.publish(this.app.contextData!._id, data.subject, JSON.parse(data.payload)).subscribe(() => {
      this.message.success(`Publish successful`);
    });
  }
}