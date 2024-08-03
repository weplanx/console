import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';

import { Any, WpxModule, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';

import { TransportDataSource } from './transport.data-source';
import { Transport } from '../types';

@Component({
  standalone: true,
  imports: [WpxModule, NzUploadModule, NzProgressModule, ScrollingModule],
  selector: 'wpx-upload-transport',
  templateUrl: './transport.component.html'
})
export class WpxUploadTransportComponent {
  @Input() wpxExt?: string;
  @Input() wpxAccept: string[] = [];
  @Output() wpxChange = new EventEmitter<Transport[]>();

  ds: TransportDataSource = new TransportDataSource();
  private readonly transports = new Map<string, Transport>();
  complete = true;
  visible = false;
  size = 0;
  done = 0;
  percent = 0;

  @ViewChild('messageRef') messageRef!: TemplateRef<Any>;
  private messageId?: string;

  constructor(
    public wpx: WpxService,
    private message: NzMessageService
  ) {}

  change(info: NzUploadChangeParam): void {
    if (this.complete) {
      this.start();
    }
    this.watch(info.file);
    if (this.size !== 0 && this.size === this.done) {
      this.success();
    }
  }

  private start(): void {
    this.visible = true;
    this.complete = false;
    this.size = 0;
    this.done = 0;
    this.percent = 0;
    this.transports.clear();
    this.messageId = this.message.loading(this.messageRef, { nzDuration: 0 }).messageId;
  }

  private watch(file: NzUploadFile): void {
    if (file.status === 'error') {
      this.message.error(`Unable to upload file [${file.name}]`);
      this.transports.delete(file.uid);
    }
    this.transports.set(file.uid, {
      name: file.name,
      percent: Math.floor(file.percent as number),
      file: file
    });
    const list = [...this.transports.values()];
    this.size = list.length;
    this.done = list.filter(v => v.file.status === 'done').length;
    this.percent = Math.floor((this.done / list.length) * 100);
    this.ds.set(list);
  }

  private success(): void {
    this.complete = true;
    this.message.remove(this.messageId);
    this.message.success(`Upload successful`);
    this.wpxChange.next([...this.transports.values()]);
  }
}
