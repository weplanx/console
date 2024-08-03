import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { WpxModel } from '@weplanx/ng';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzInputModule, NzToolTipModule],
  selector: 'wpx-keyword',
  template: `
    <nz-input-group [ngStyle]="{ width: wpxWidth + 'px' }" nzSuffixIcon="search">
      <input
        nz-input
        [disabled]="!!wpxModel.advanced()"
        [placeholder]="wpxPlaceholder"
        [(ngModel)]="wpxModel.searchText"
        (keyup.enter)="submit()"
      />
    </nz-input-group>
  `
})
export class WpxKeywordComponent<T> {
  @Input({ required: true }) wpxModel!: WpxModel<T>;
  @Input({ required: true }) wpxKeys!: string[];
  @Input() wpxWidth = 220;
  @Input() wpxPlaceholder = 'Search';
  @Output() wpxSubmit = new EventEmitter<void>();

  submit(): void {
    this.wpxModel.keywords = !this.wpxModel.searchText
      ? []
      : this.wpxKeys.map(key => ({
          [key]: { $regex: this.wpxModel.searchText }
        }));
    this.wpxSubmit.emit();
  }
}
