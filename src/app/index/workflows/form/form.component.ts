import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppService } from '@app';
import { Workflow } from '@common/models/workflow';
import { WorkflowsService } from '@common/services/workflows.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface FormInput {
  doc?: AnyDto<Workflow>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-index-workflows-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    kind: ['schedule', [Validators.required]]
  });
  tips = {
    name: {
      default: {
        required: `Workflow Name cannot be empty`
      }
    },
    kind: {
      default: {
        required: `Kind cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private workflows: WorkflowsService,
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

  submit(data: Any): void {
    if (!this.data.doc) {
      data.project = this.app.contextData!._id;
      this.workflows
        .create(data, {
          xdata: { project: 'oid' }
        })
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    } else {
      this.workflows.updateById(this.data.doc._id, { $set: data }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    }
  }
}
