import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

import { Builder, Field } from '@common/models/builder';
import { BuildersService } from '@common/services/builders.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

export interface FieldInput {
  doc: AnyDto<Builder>;
  field?: Field;
}

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-index-builders-field',
  templateUrl: './field.component.html'
})
export class FieldComponent implements OnInit {
  form: FormGroup = this.fb.group({
    type: ['', [Validators.required]],
    name: ['', [Validators.required]],
    key: ['', [Validators.required]],
    placeholder: [''],
    description: [''],
    required: [false, [Validators.required]],
    visible: [false, [Validators.required]],
    default_to: [null]
  });
  tabIndex = 0;
  typeItems = [
    { label: 'Input', value: 'string', icon: 'field-string', description: 'Title or description' },
    { label: 'Text', value: 'text', icon: 'align-left', description: 'Text field for textarea' },
    { label: 'Number', value: 'number', icon: 'field-number', description: 'Quantity, price, percentage' },
    { label: 'Date', value: 'date', icon: 'carry-out', description: 'Specified date' },
    { label: 'Password', value: 'password', icon: 'lock', description: 'Hash encrypted field' },
    { label: 'RichText', value: 'richtext', icon: 'holder', description: 'JSON block text editor' },
    { label: 'Switch', value: 'bool', icon: 'switcher', description: 'State control' },
    { label: 'Dates', value: 'dates', icon: 'calendar', description: 'Date range selector' },
    { label: 'Radio', value: 'radio', icon: 'aim', description: 'Enumerate radio' },
    { label: 'Checkbox', value: 'checkbox', icon: 'check', description: 'Enumerate checkbox' },
    { label: 'Select', value: 'select', icon: 'unordered-list', description: 'Enumeration or collection tags' },
    { label: 'Ref', value: 'ref', icon: 'link', description: 'Reference external collection' },
    { label: 'Picture', value: 'picture', icon: 'picture', description: 'Picture selector' },
    { label: 'Video', value: 'video', icon: 'video-camera', description: 'Video selector' },
    { label: 'File', value: 'file', icon: 'file-text', description: 'File selector' },
    { label: 'Manual', value: 'manual', icon: 'code', description: 'Custom components' }
  ];
  infinity = Infinity;

  refers: Array<AnyDto<Builder>> = [];
  referDict: Record<string, AnyDto<Builder>> = {};
  referFields: Field[] = [];

  referText$ = new BehaviorSubject<string>('');
  referSubscription?: Subscription;
  referItems: AnyDto<Any>[] = [];

  constructor(
    @Inject(NZ_MODAL_DATA)
    public data: FieldInput,
    private fb: FormBuilder,
    private modal: NzModalService,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private builders: BuildersService
  ) {}

  ngOnInit(): void {
    this.watchType();
    if (this.data.field) {
      this.tabIndex = 1;
      this.form.patchValue(this.data.field);
    }
  }

  get type(): FormControl {
    return this.form.get('type') as FormControl;
  }

  private watchType(): void {
    this.type.valueChanges.subscribe(type => {
      this.form.removeControl('option');
      this.refers = [];
      this.referDict = {};
      this.referFields = [];
      this.referSubscription?.unsubscribe();
      switch (type) {
        case 'number':
          this.form.setControl(
            'option',
            this.fb.group({
              max: [null],
              min: [null],
              decimal: [2]
            })
          );
          break;
        case 'date':
        case 'dates':
          this.form.setControl(
            'option',
            this.fb.group({
              time: [false]
            })
          );
          break;
        case 'radio':
        case 'checkbox':
          this.form.setControl(
            'option',
            this.fb.group({
              enums: this.fb.array([])
            })
          );
          this.data.field?.option?.enums?.forEach(() => this.addOptionEnum());
          break;
        case 'select':
          this.form.setControl(
            'option',
            this.fb.group({
              enums: this.fb.array([]),
              multiple: [false]
            })
          );
          this.data.field?.option?.enums?.forEach(() => this.addOptionEnum());
          break;
        case 'ref':
          this.form.setControl(
            'option',
            this.fb.group({
              ref: [null, [Validators.required]],
              ref_key: [null, [Validators.required]],
              multiple: [false]
            })
          );
          this.builders.getRefs().subscribe(({ data }) => {
            this.refers = [...data];
            this.refers.forEach(v => {
              this.referDict[v._id] = v;
            });
          });
          this.optionRef.valueChanges.subscribe(id => {
            this.referFields = [
              ...this.referDict[id].schema!.fields.filter(v => ['string', 'number', 'bool'].includes(v.type))
            ];
          });
          break;
        case 'manual':
          this.form.setControl(
            'option',
            this.fb.group({
              component: [null, [Validators.required]]
            })
          );
          break;
      }
    });
  }

  get option(): FormControl {
    return this.form.get('option') as FormControl;
  }

  get optionMax(): FormControl {
    return this.option.get('max') as FormControl;
  }

  get optionMin(): FormControl {
    return this.option.get('min') as FormControl;
  }

  get optionDecimal(): FormControl {
    return this.option.get('decimal') as FormControl;
  }

  get optionTime(): FormControl {
    return this.option.get('time') as FormControl;
  }

  get optionEnums(): FormArray {
    return this.form.get('option')?.get('enums') as FormArray;
  }

  addOptionEnum(): void {
    this.optionEnums.push(
      this.fb.group({
        label: [null, [Validators.required]],
        value: [null, [Validators.required]]
      })
    );
  }

  removeOptionEnum(index: number): void {
    this.optionEnums.removeAt(index);
  }

  get optionRef(): FormControl {
    return this.option.get('ref') as FormControl;
  }

  get optionRefKey(): FormControl {
    return this.option.get('ref_key') as FormControl;
  }

  get optionMultiple(): FormControl {
    return this.option.get('multiple') as FormControl;
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    if (!this.data.field) {
      this.builders.addSchemaField(this.data.doc._id, data).subscribe(() => {
        this.modalRef.triggerOk();
        this.message.success('Field update successful');
      });
    } else {
      this.builders.updateSchemaField(this.data.doc._id, this.data.field.key, data).subscribe(() => {
        this.modalRef.triggerOk();
        this.message.success('Field update successful');
      });
    }
  }
}
