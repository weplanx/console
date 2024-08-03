import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PicturesService } from '@common/services/pictures.service';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { WpxFilebroserInputComponent } from '@weplanx/ng/filebrowser';

@Component({
  standalone: true,
  imports: [ShareModule, WpxFilebroserInputComponent],
  selector: 'app-pictures-input',
  template: `
    <wpx-filebrowser-input
      [wpxApi]="pictures"
      [wpxType]="'picture'"
      [wpxFallback]="['assets', 'photon.svg'] | wpxAssets"
      [wpxLimit]="limit"
      [(wpxValue)]="value"
      (wpxValueChange)="onChanged($event)"
    >
    </wpx-filebrowser-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PicturesInputComponent),
      multi: true
    }
  ]
})
export class PicturesInputComponent implements ControlValueAccessor {
  @Input() limit = 5;
  value: string[] = [];

  onChanged!: (value: string[]) => void;
  private onTouched!: () => void;

  constructor(public pictures: PicturesService) {}

  registerOnChange(fn: Any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(v: string[]): void {
    this.value = v;
  }
}
