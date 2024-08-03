import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { AccTask } from '@common/models/acc-task';
import { AccTasksService } from '@common/services/acc-tasks.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface FormInput {
  doc?: AnyDto<AccTask>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-acc-tasks-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    kind: ['static', [Validators.required]],
    source: ['', [Validators.required]],
    target: ['', [Validators.required]]
  });
  tips = {
    kind: {
      default: {
        required: `Resource Kind cannot be empty`
      }
    },
    source: {
      default: {
        required: `Source URL cannot be empty`
      }
    },
    target: {
      default: {
        required: `Target URL cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private accTasks: AccTasksService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    if (this.data.doc) {
      this.form.patchValue(this.data.doc);
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  generateSecret(): void {
    this.app.generateSecret().subscribe(data => {
      this.form.patchValue({
        secret_id: data.id,
        secret_key: data.key
      });
    });
  }

  submit(data: Any): void {
    if (!this.data.doc) {
      this.accTasks.create(data).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    } else {
      this.accTasks.updateById(this.data.doc._id, { $set: data }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    }
  }
}
