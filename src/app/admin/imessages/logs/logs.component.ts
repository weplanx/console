import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';

import { CodeviewComponent } from '@common/components/codeview/codeview.component';
import { LogsetImessage } from '@common/models/logset-imessage';
import { LogsetImessagesService } from '@common/services/logset-imessages.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto, Filter, WpxModel, WpxService } from '@weplanx/ng';
import { addHours } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-imessages-logs',
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit {
  @Input({ required: true }) topic!: string;

  model: WpxModel<LogsetImessage> = this.wpx.setModel<LogsetImessage>(`imessages:${this.topic}`, this.imessages);
  clientText = '';
  timestamp: Date[] = [];

  constructor(
    private wpx: WpxService,
    private imessages: LogsetImessagesService,
    private modal: NzModalService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.timestamp = [addHours(now, -12), now];
    this.model
      .ready({
        'timestamp->$gte': 'date',
        'timestamp->$lt': 'date'
      })
      .subscribe(() => {
        this.getData();
      });
  }

  getData(refresh = false): void {
    if (refresh) {
      this.model.page = 1;
    }
    const filter: Filter<LogsetImessage> = {
      'metadata.topic': this.topic
    };
    if (this.clientText !== '') {
      filter['metadata.client'] = this.clientText;
    }
    if (this.timestamp.length !== 0) {
      filter.timestamp = {
        $gte: this.timestamp[0].toUTCString() as Any,
        $lt: this.timestamp[1].toUTCString() as Any
      };
    }

    this.model.fetch(filter, { timestamp: -1 }).subscribe();
  }

  clear(): void {
    this.timestamp = [];
    this.getData(true);
  }

  openResponse(data: AnyDto<LogsetImessage>): void {
    this.modal.create<CodeviewComponent>({
      nzTitle: `Payload [${formatDate(data.timestamp, 'medium', this.locale)}]`,
      nzContent: CodeviewComponent,
      nzData: data.payload,
      nzWidth: 960,
      nzFooter: null
    });
  }
}
