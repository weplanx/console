import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Cluster } from '@common/models/cluster';
import { ClustersService } from '@common/services/clusters.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface FormInput {
  doc?: AnyDto<Cluster>;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-clusters-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    kind: ['kubernetes', [Validators.required]],
    config: this.fb.group({
      host: ['', [Validators.required]],
      ca_data: ['', [Validators.required]],
      cert_data: ['', [Validators.required]],
      key_data: ['', [Validators.required]]
    }),
    admin: [false]
  });
  tips = {
    name: {
      default: {
        required: `Cluster Name cannot be empty`
      }
    },
    config: {
      default: {
        required: `Value cannot be empty`
      }
    }
  };
  edit = false;

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private clusters: ClustersService
  ) {}

  ngOnInit(): void {
    if (this.data.doc) {
      this.edit = true;
      this.form.get('kind')?.disable();
      this.form.removeControl('config');
      this.form.patchValue({
        name: this.data.doc.name,
        kind: this.data.doc.kind,
        admin: this.data.doc.admin
      });
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    data.config = JSON.stringify(data.config);
    if (!this.data.doc) {
      data.kind = 'kubernetes';
      this.clusters
        .create(data, {
          xdata: { config: 'cipher' }
        })
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    } else {
      this.clusters
        .updateById(
          this.data.doc._id,
          { $set: data },
          {
            xdata: { '$set->config': 'cipher' }
          }
        )
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    }
  }
}
