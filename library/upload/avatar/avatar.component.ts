import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Any, WpxModule, WpxService } from '@weplanx/ng';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  standalone: true,
  imports: [WpxModule, NzUploadModule, NzImageModule],
  selector: 'wpx-upload-avatar',
  templateUrl: './avatar.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WpxUploadAvatarComponent),
      multi: true
    }
  ]
})
export class WpxUploadAvatarComponent implements ControlValueAccessor {
  @Input() wpxExt?: string;
  @Input() wpxAccept: string[] = [];
  @Input() wpxFallback!: string;

  loading = false;
  url?: string;

  private onChange!: (value: string) => void;
  private onTouched!: () => void;

  constructor(
    public wpx: WpxService,
    private message: NzMessageService
  ) {}

  registerOnChange(fn: Any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(v: Any): void {
    this.url = v;
  }

  change(info: NzUploadChangeParam): void {
    if (info.type === 'start') {
      this.url = undefined;
      this.loading = true;
    }
    if (info.type === 'success') {
      this.url = Reflect.get(info.file.originFileObj as File, 'key');
      this.onChange(this.url as string);
      this.loading = false;
      this.message.success(`Upload successful`);
    }
  }
}
