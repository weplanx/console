import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Any, AnyDto, WpxApi, WpxModule } from '@weplanx/ng';
import { WpxCategory } from '@weplanx/ng/categories';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { WpxFile } from '../types';

export interface FormInput {
  doc: AnyDto<WpxFile>;
  api: WpxApi<WpxFile>;
  categories: AnyDto<WpxCategory>[];
}

@Component({
  standalone: true,
  imports: [WpxModule],
  selector: 'wpx-filebrowser-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    categories: [[]]
  });
  tips = {
    name: {
      default: {
        required: `Name cannot be empty`
      }
    }
  };

  constructor(
    @Inject(NZ_MODAL_DATA) public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.data.doc);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.data.api
      .updateById(
        this.data.doc._id,
        { $set: data },
        {
          xdata: { '$set->categories': 'oids' }
        }
      )
      .subscribe(() => {
        this.data.doc.name = data.name;
        this.data.doc.categories = data.categories;
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
  }
}
