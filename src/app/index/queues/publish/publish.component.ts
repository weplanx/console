import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { QueuesService } from '@common/services/queues.service';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { JoinedEditorOptions, NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface PublishInput {
  subject?: string;
}

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'app-index-queues-publish',
  templateUrl: './publish.component.html'
})
export class PublishComponent implements OnInit {
  form: FormGroup = this.fb.group({
    subject: ['', [Validators.required]],
    payload: ['', [Validators.required]]
  });
  tips = {
    subject: {
      default: {
        required: `Subject cannot be empty`
      }
    }
  };
  option: JoinedEditorOptions = { language: 'json' };

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
