import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Any, AnyDto, WpxModule } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { WpxCategoriesService } from '../categories.service';
import { WpxCategory } from '../types';

export interface FormInput {
  type: string;
  doc?: AnyDto<WpxCategory>;
}

@Component({
  standalone: true,
  imports: [WpxModule],
  selector: 'wpx-categories-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]]
  });
  tips = {
    name: {
      default: {
        required: `Name cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private categories: WpxCategoriesService
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
    data.type = this.data.type;
    if (!this.data.doc) {
      data.sort = 0;
      this.categories.create(data).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    } else {
      this.categories.updateById(this.data.doc._id, { $set: data }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    }
  }
}
