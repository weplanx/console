import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { Queue } from '@common/models/queue';
import { QueuesService } from '@common/services/queues.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface FormInput {
  doc?: AnyDto<Queue>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-index-queues-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    subjects: [[], [Validators.required]],
    description: [''],
    max_msgs: [-1],
    max_bytes: [-1],
    max_age: [0]
  });
  tips = {
    name: {
      default: {
        required: `Queue Name cannot be empty`
      }
    },
    subjects: {
      default: {
        required: `Subjects cannot be empty`
      }
    }
  };
  formatterSec = (value: number): string => `${value} sec`;

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private queues: QueuesService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    if (this.data.doc) {
      const data = { ...this.data.doc };
      if (data.max_age) {
        data.max_age = data.max_age / 1e9;
      }
      this.form.patchValue(data);
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    data['max_age'] = data['max_age'] * 1e9;
    if (!this.data.doc) {
      data['project'] = this.app.contextData!._id;
      this.queues.create(data, { xdata: { project: 'oid' } }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    } else {
      this.queues
        .updateById(
          this.data.doc._id,
          { $set: data },
          {
            xdata: { '$set->project': 'oid' }
          }
        )
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    }
  }
}
