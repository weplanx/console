import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Any, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-datasets-controls',
  templateUrl: './controls.component.html'
})
export class ControlsComponent implements OnInit {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) updated!: () => void;

  index = 0;
  form!: FormGroup;

  private controls: Any;

  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private wpx: WpxService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      Keys: this.fb.array([]),
      Sensitives: this.fb.array([])
    });
    this.wpx.getValues(['RestControls']).subscribe(data => {
      this.controls = data['RestControls'];
      const v = data['RestControls'][this.name];
      (v.Keys as string[])?.forEach(v => this.appendKey(v));
      (v.Sensitives as string[])?.forEach(v => this.appendSensitive(v));
    });
  }

  get keys(): FormArray {
    return this.form!.get('Keys') as FormArray;
  }

  appendKey(value?: string): void {
    this.keys.push(this.fb.control(value, [Validators.required]));
  }

  removeKey(index: number): void {
    this.keys.removeAt(index);
  }

  get sensitives(): FormArray {
    return this.form!.get('Sensitives') as FormArray;
  }

  appendSensitive(value?: string): void {
    this.sensitives.push(this.fb.control(value, [Validators.required]));
  }

  removeSensitive(index: number): void {
    this.sensitives.removeAt(index);
  }

  sort(event: CdkDragDrop<string[]>, data: FormArray): void {
    moveItemInArray(data.controls, event.previousIndex, event.currentIndex);
    data.controls.forEach((value, index) => data.setControl(index, value));
  }

  submit(data: Any): void {
    this.controls[this.name] = { ...data };
    this.wpx.setValues({ RestControls: this.controls }).subscribe(() => {
      this.message.success(`数据更新成功`);
      this.updated();
    });
  }
}
