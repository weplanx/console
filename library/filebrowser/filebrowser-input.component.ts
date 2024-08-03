import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Inject, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { Any, WpxApi, WpxModule, WpxService } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { WpxFilebrowserComponent, WpxFilebrowserInput } from './filebrowser.component';
import { OPTION } from './provide';
import { WpxFileType, WpxFile, Option } from './types';
import { VideoComponent } from './video/video.component';

@Component({
  standalone: true,
  imports: [WpxModule, NzEmptyModule, NzImageModule, DragDropModule],
  selector: 'wpx-filebrowser-input',
  templateUrl: `./filebrowser-input.component.html`,
  styleUrl: './filebrowser-input.component.css'
})
export class WpxFilebroserInputComponent<T extends WpxFile> {
  @ViewChild('footerRef') footerRef!: TemplateRef<Any>;
  @ViewChild('sortRef') sortRef!: TemplateRef<Any>;
  modalRef?: NzModalRef<Any>;

  @Input({ required: true }) wpxValue!: string[];
  @Input({ required: true }) wpxApi!: WpxApi<T>;
  @Input({ required: true }) wpxType!: WpxFileType;
  @Input({ required: true }) wpxFallback!: string;
  @Input() wpxHeight = 640;
  @Input() wpxWidth = 1200;
  @Input() wpxLimit?: number;
  @Output() wpxValueChange = new EventEmitter<string[]>();

  constructor(
    @Inject(OPTION) public option: Option,
    private wpx: WpxService,
    private modal: NzModalService,
    private drawer: NzDrawerService,
    private image: NzImageService
  ) {}

  get instance(): WpxFilebrowserComponent<T> {
    return this.modalRef?.componentInstance;
  }

  view(): void {
    this.modalRef = this.modal.create<WpxFilebrowserComponent<T>, WpxFilebrowserInput<T>>({
      nzClosable: false,
      nzBodyStyle: { height: this.wpxHeight + 'px', padding: '8px 24px 24px' },
      nzWidth: this.wpxWidth,
      nzContent: WpxFilebrowserComponent,
      nzData: {
        api: this.wpxApi,
        type: this.wpxType,
        fallback: this.wpxFallback
      },
      nzFooter: this.footerRef,
      nzOnOk: instance => {
        const urls = [...instance.ds.selection.values()].map(v => `${v.url}${!v.query ? '' : '?' + v.query}`);
        this.wpxValue = [...this.wpxValue, ...urls];
        this.wpxValueChange.emit(this.wpxValue);
      }
    });
  }

  remove(i: number): void {
    this.wpxValue.splice(i, 1);
    this.wpxValueChange.emit(this.wpxValue);
  }

  openSort(): void {
    this.drawer.create({
      nzTitle: '*Drag and drop images to sort',
      nzClosable: false,
      nzWidth: 350,
      nzContent: this.sortRef
    });
  }

  sort(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.wpxValue, event.previousIndex, event.currentIndex);
    this.wpxValueChange.emit(this.wpxValue);
  }

  preview(url: string): void {
    this.image.preview([{ src: `${this.wpx.assets}/${url}` }]);
  }

  video(url: string): void {
    this.modal.create<VideoComponent>({
      nzWidth: 960,
      nzClosable: false,
      nzContent: VideoComponent,
      nzData: {
        url
      },
      nzFooter: null
    });
  }
}
