import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit } from '@angular/core';

import { CodeviewComponent } from '@common/components/codeview/codeview.component';
import { LogsetJob } from '@common/models/logset-job';
import { Workflow } from '@common/models/workflow';
import { LogsetJobsService } from '@common/services/logset-jobs.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto, Filter, WpxModel, WpxService } from '@weplanx/ng';
import { addHours } from 'date-fns';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule, CodeviewComponent],
  selector: 'app-index-workflows-logs',
  templateUrl: './logs.component.html'
})
export class LogsComponent implements OnInit {
  @Input({ required: true }) doc!: AnyDto<Workflow>;
  @Input({ required: true }) index!: number;

  model!: WpxModel<LogsetJob>;
  timestamp: Date[] = [];

  constructor(
    private wpx: WpxService,
    private jobs: LogsetJobsService,
    private modal: NzModalService,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.timestamp = [addHours(now, -12), now];
    this.model = this.wpx.setModel<LogsetJob>(`jobs:${this.index}`, this.jobs);
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
    const filter: Filter<LogsetJob> = {
      'metadata.key': this.doc._id,
      'metadata.index': this.index
    };

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

  openResponse(data: AnyDto<LogsetJob>): void {
    this.modal.create<CodeviewComponent>({
      nzTitle: `Detail [${formatDate(data.timestamp, 'long', this.locale)}]`,
      nzContent: CodeviewComponent,
      nzData: data.response.body,
      nzWidth: 960,
      nzFooter: null
    });
  }
}
