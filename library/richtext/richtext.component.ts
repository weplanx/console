import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { auditTime, BehaviorSubject, delay, from, switchMap } from 'rxjs';

import { Any, WpxModule, WpxService } from '@weplanx/ng';
import { WpxFilebrowserComponent } from '@weplanx/ng/filebrowser';

import { defaultTools, zh_CN } from './helper';
import { Image } from './image';
import { ResolveDone, RichtextData } from './types';
import { Video } from './video';

declare const EditorJS: Any;

@Component({
  standalone: true,
  imports: [WpxModule, WpxFilebrowserComponent],
  selector: 'wpx-richtext',
  exportAs: 'wpxRichtext',
  template: `<div class="wpx-richtext" #richtext> </div>`,
  styleUrl: './richtext.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WpxRichtextComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxRichtextComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  @ViewChild('richtext', { static: true }) ref!: ElementRef;
  @Input() wpxPlaceholder?: string;
  @Input() wpxFallback?: string;
  @Input() wpxPictures?: (done: ResolveDone) => void;
  @Input() wpxVideos?: (done: ResolveDone) => void;

  $data: BehaviorSubject<RichtextData> = new BehaviorSubject(<RichtextData>null);
  /**
   * EditorJS
   * @private
   */
  private instance?: Any;
  private onChange!: (value: Any) => void;
  private onTouched?: () => void;

  constructor(
    private wpx: WpxService,
    private platform: Platform,
    private zone: NgZone
  ) {}

  registerOnChange(fn: Any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(data: RichtextData): void {
    this.$data.next(data);
  }

  ngAfterViewInit(): void {
    if (!this.platform.isBrowser) {
      return;
    }
    this.wpx.scripts
      .get('editorjs')!
      .pipe(delay(200))
      .subscribe(() => {
        this.initialize();
      });
    return;
  }

  ngOnDestroy(): void {
    if (!this.instance) {
      return;
    }
    from(this.instance.isReady).subscribe(() => {
      this.instance!.destroy();
    });
  }

  private initialize(): void {
    this.zone.runOutsideAngular(() => {
      const tools = { ...defaultTools(window) };
      if (this.wpxPictures) {
        tools.image = {
          class: Image,
          config: {
            resolve: (done: ResolveDone) => this.zone.run(() => this.wpxPictures!(done)),
            change: () => this.save()
          }
        };
      }
      if (this.wpxVideos) {
        tools.video = {
          class: Video,
          config: {
            resolve: (done: ResolveDone) => this.zone.run(() => this.wpxVideos!(done)),
            change: () => this.save()
          }
        };
      }
      this.instance = new EditorJS({
        holder: this.ref.nativeElement,
        placeholder: this.wpxPlaceholder,
        logLevel: 'ERROR',
        tools,
        i18n: zh_CN,
        onChange: () => this.save()
      });

      from(this.instance!.isReady)
        .pipe(switchMap(() => this.$data))
        .subscribe(data => {
          if (data) {
            this.instance!.render(data);
          }
        });
    });
  }

  private save(): void {
    from(this.instance?.save() as Promise<RichtextData>)
      .pipe(auditTime(300))
      .subscribe(data => {
        this.onChange(data);
      });
  }
}
