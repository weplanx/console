import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { Order } from '../types';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'x-table-form',
  template: ``
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({});

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: {
      doc?: AnyDto<Order>;
    },
    private modalRef: NzModalRef,
    private fb: FormBuilder
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
    console.log(data);
  }
}
