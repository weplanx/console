import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { AppService } from '@app';
import { Builder } from '@common/models/builder';
import { BuildersService } from '@common/services/builders.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto, Filter } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';

export interface FormInput {
  doc?: AnyDto<Builder>;
}

@Component({
  standalone: true,
  imports: [ShareModule, NzTreeSelectModule],
  selector: 'app-index-builders-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  form: FormGroup = this.fb.group({
    parent: [null],
    name: ['', [Validators.required]],
    kind: ['', [Validators.required]],
    icon: [''],
    description: [''],
    status: [true, [Validators.required]]
  });
  tips = {
    name: {
      default: {
        required: `Name cannot be empty`
      }
    },
    kind: {
      default: {
        required: 'Kind cannot be empty'
      }
    },
    schemaKey: {
      default: {
        required: `Schema Key cannot be empty`,
        duplicated: `Schema Key must be unique`
      }
    }
  };
  nodes: NzTreeNodeOptions[] = [];

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FormInput,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private app: AppService,
    private builders: BuildersService
  ) {}

  ngOnInit(): void {
    const filter: Filter<Builder> = { kind: 'nav' };
    this.kind.valueChanges.subscribe(data => {
      if (['collection', 'single'].includes(data)) {
        this.form.addControl(
          'schema',
          this.fb.group({
            key: ['', [Validators.required], [this.checkSchemaKey]],
            fields: [[]],
            rules: [[]]
          })
        );
      } else {
        this.form.removeControl('schema');
      }
    });
    if (this.data.doc) {
      filter._id = { $ne: this.data.doc._id };
      this.kind.disable();
      this.form.patchValue(this.data.doc);
    }
    this.getNodes(filter);
  }

  checkSchemaKey = (control: AbstractControl): Observable<Any> => {
    if (control.value === this.data.doc?.schema?.key) {
      return of(null);
    }
    return this.builders.existsSchemaKey(control.value);
  };

  get kind(): FormControl {
    return this.form.get('kind') as FormControl;
  }

  getNodes(filter: Filter<Builder>): void {
    this.builders
      .getNzTreeNodeOptions(
        v =>
          <NzTreeNodeOptions>{
            title: v.name,
            key: v._id,
            parent: v.parent,
            isLeaf: true
          },
        filter,
        { '_id->$ne': 'oid' }
      )
      .subscribe(v => {
        this.nodes = [...v];
      });
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    if (!this.data.doc) {
      data['project'] = this.app.contextData!._id;
      data['sort'] = 0;
      this.builders.create(data, { xdata: { project: 'oid', parent: 'oid' } }).subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
    } else {
      this.builders
        .updateById(
          this.data.doc._id,
          { $set: data },
          {
            xdata: { '$set->project': 'oid', '$set->parent': 'oid' }
          }
        )
        .subscribe(() => {
          this.message.success(`Update successful`);
          this.modalRef.triggerOk();
        });
    }
  }
}
