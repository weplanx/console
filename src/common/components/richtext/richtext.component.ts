import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PicturesService } from '@common/services/pictures.service';
import { VideosService } from '@common/services/videos.service';
import { Any, WpxModule, WpxService } from '@weplanx/ng';
import { WpxFile, WpxFilebrowserComponent, WpxFilebrowserInput } from '@weplanx/ng/filebrowser';
import { ResolveDone, RichtextData, WpxRichtextComponent } from '@weplanx/ng/richtext';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [WpxModule, WpxRichtextComponent],
  selector: 'app-richtext',
  templateUrl: './richtext.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichtextComponent implements ControlValueAccessor {
  @ViewChild('footerRef') footerRef!: TemplateRef<Any>;
  @ViewChild(WpxRichtextComponent) richtext!: WpxRichtextComponent;

  placeholder = `Please enter content`;
  value: RichtextData | null = null;
  modalRef?: NzModalRef<WpxFilebrowserComponent<Any>>;

  onChanged!: (value: Any) => void;
  private onTouched!: () => void;

  constructor(
    private modal: NzModalService,
    private wpx: WpxService,
    @Optional() private pictures: PicturesService,
    @Optional() private videos: VideosService
  ) {}

  registerOnChange(fn: Any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(v: RichtextData): void {
    this.value = v;
  }

  get instance(): WpxFilebrowserComponent<WpxFile> {
    return this.modalRef?.componentInstance as WpxFilebrowserComponent<Any>;
  }

  openPictures = (done: ResolveDone): void => {
    this.modalRef = this.modal.create<WpxFilebrowserComponent<WpxFile>, WpxFilebrowserInput<WpxFile>>({
      nzClosable: false,
      nzBodyStyle: { height: '640px', padding: '8px 24px 24px' },
      nzWidth: 1200,
      nzContent: WpxFilebrowserComponent,
      nzData: {
        api: this.pictures,
        type: 'picture',
        fallback: this.richtext.wpxFallback!
      },
      nzFooter: this.footerRef,
      nzOnOk: instance => {
        const data = [...instance.ds.selection.values()][0];
        done({
          assets: this.wpx.assets,
          url: data.url + (!data.query ? '' : '?' + data.query)
        });
      }
    });
  };

  openVideos = (done: ResolveDone): void => {
    this.modalRef = this.modal.create<WpxFilebrowserComponent<WpxFile>, WpxFilebrowserInput<WpxFile>>({
      nzClosable: false,
      nzBodyStyle: { height: '640px', padding: '8px 24px 24px' },
      nzWidth: 1200,
      nzContent: WpxFilebrowserComponent,
      nzData: {
        api: this.videos,
        type: 'video',
        fallback: this.richtext.wpxFallback!
      },
      nzFooter: this.footerRef,
      nzOnOk: instance => {
        const data = [...instance.ds.selection.values()][0];
        done({
          assets: this.wpx.assets,
          url: data.url + (!data.query ? '' : '?' + data.query)
        });
      }
    });
  };
}
