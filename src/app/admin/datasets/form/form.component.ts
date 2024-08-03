import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatasetsService } from '@common/services/datasets.service';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-datasets-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    kind: ['collection', [Validators.required]]
  });
  tips = {
    name: {
      default: {
        required: `Collection Name cannot be empty`
      }
    },
    kind: {
      default: {
        required: `Kind cannot be empty`
      }
    }
  };
  formatterDay = (value: number): string => `${value} days`;

  constructor(
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private datasets: DatasetsService
  ) {}

  ngOnInit(): void {
    this.form.get('kind')!.valueChanges.subscribe(value => {
      this.initOption(value);
    });
  }

  initOption(kind: string): void {
    if (kind === 'timeseries') {
      this.form.addControl(
        'option',
        this.fb.group({
          time: ['timestamp', [Validators.required]],
          meta: ['metadata', [Validators.required]],
          expire: [0, [Validators.required]]
        })
      );
    } else {
      this.form.removeControl('option');
    }
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.datasets.create(data).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
