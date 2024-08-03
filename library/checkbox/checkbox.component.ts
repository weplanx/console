import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Any } from '@weplanx/ng';
import { NzCheckboxModule, NzCheckBoxOptionInterface } from 'ng-zorro-antd/checkbox';

@Component({
  standalone: true,
  imports: [NzCheckboxModule, FormsModule],
  selector: 'wpx-checkbox',
  template: ` <nz-checkbox-group [(ngModel)]="wpxOptions" (ngModelChange)="changed($event)"></nz-checkbox-group> `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WpxCheckboxComponent),
      multi: true
    }
  ]
})
export class WpxCheckboxComponent implements ControlValueAccessor {
  @Input() wpxOptions: NzCheckBoxOptionInterface[] = [];

  values?: string[];

  private onChange?: (value: string[]) => void;
  private onTouched?: () => void;

  registerOnChange(fn: Any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(value: Any): void {
    this.values = value ?? [];
    this.wpxOptions = [
      ...this.wpxOptions.map(v => {
        v.checked = this.values?.includes(v.value);
        return v;
      })
    ];
  }

  changed(data: NzCheckBoxOptionInterface[]): void {
    this.values = [...data.filter(v => v.checked).map(v => v.value)];
    this.onChange!(this.values);
  }
}
