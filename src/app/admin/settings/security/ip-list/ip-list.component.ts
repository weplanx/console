import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';

import { ShareModule } from '@common/share.module';
import { Any, WpxService } from '@weplanx/ng';
import Joi from 'joi';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

export interface IpListData {
  type: 'IpWhitelist' | 'IpBlacklist';
  ip: string[];
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-settings-security-ip-list',
  templateUrl: './ip-list.component.html'
})
export class IpListComponent implements OnInit {
  checkIp = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { required: true };
    }
    if (this.ipSchema.validate(control.value).error) {
      return { error: true };
    }
    return {};
  };
  form: FormGroup = this.fb.group({
    [this.data.type]: this.fb.array([])
  });
  private ipSchema = Joi.string().ip();

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: IpListData,
    private wpx: WpxService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.data.ip?.forEach(v => {
      this.append(v);
    });
  }

  get list(): FormArray {
    return this.form?.get(this.data.type) as FormArray;
  }

  append(value?: string): void {
    this.list.push(this.fb.control(value, [this.checkIp]));
  }

  remove(index: number): void {
    this.list.removeAt(index);
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.wpx.setValues(data).subscribe(() => {
      this.message.success(`Update successful`);
      this.modalRef.triggerOk();
    });
  }
}
