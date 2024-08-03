import { Directive, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

import { Any } from '../types';
import { updateFormGroup } from '../utils/helper';

@Directive({
  standalone: true,
  selector: 'form[wpxSubmit]'
})
export class WpxSubmitDirective implements OnInit {
  @Output() readonly wpxSubmit: EventEmitter<Any> = new EventEmitter<Any>();

  constructor(private formGroup: FormGroupDirective) {}

  ngOnInit(): void {
    this.formGroup.ngSubmit.subscribe(() => {
      if (!this.formGroup.valid) {
        updateFormGroup(Object.values(this.formGroup.control.controls));
      } else {
        this.wpxSubmit.emit(this.formGroup.value);
      }
    });
  }
}
