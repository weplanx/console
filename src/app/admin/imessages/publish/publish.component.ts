import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ImessagesService } from '@common/services/imessages.service';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { JoinedEditorOptions, NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface PublishInput {
  topic?: string;
}

@Component({
  standalone: true,
  imports: [ShareModule, NzCodeEditorModule],
  selector: 'app-admin-imessages-publish',
  templateUrl: './publish.component.html'
})
export class PublishComponent implements OnInit {
  form: FormGroup = this.fb.group({
    topic: ['', [Validators.required]],
    payload: ['', [Validators.required]]
  });
  tips = {
    topic: {
      default: {
        required: `Topic cannot be empty`
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
    private imessages: ImessagesService
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
    this.imessages.publish(data.topic, JSON.parse(data.payload)).subscribe(() => {
      this.message.success(`Publish successful`);
    });
  }
}
