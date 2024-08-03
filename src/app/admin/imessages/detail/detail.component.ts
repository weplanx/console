import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';

import { Imessage, Metrics } from '@common/models/imessage';
import { Project } from '@common/models/project';
import { ImessagesService } from '@common/services/imessages.service';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

import { CountRateComponent } from './count-rate.component';
import { LogsComponent } from '../logs/logs.component';
import { PublishComponent, PublishInput } from '../publish/publish.component';

@Component({
  standalone: true,
  imports: [ShareModule, NzSegmentedModule, CountRateComponent],
  selector: 'app-admin-imessages-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit, OnDestroy {
  @Input({ required: true }) doc!: AnyDto<Imessage>;
  options = ['All', 'QoS0', 'QoS1', 'QoS2'];
  index = 0;

  projectDict: Record<string, AnyDto<Project>> = {};
  metricsDict: Record<string, Metrics> = {};

  private refresh!: Subscription;

  constructor(
    private projects: ProjectsService,
    private imessages: ImessagesService,
    private message: NzMessageService,
    private modal: NzModalService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.getProjects(this.doc.projects);
    this.refresh = timer(500, 5000)
      .pipe(switchMap(() => this.imessages.getMetrics(this.doc._id)))
      .subscribe(data => {
        data.forEach(v => (this.metricsDict[v.topic] = v.metrics));
      });
  }

  ngOnDestroy(): void {
    this.refresh?.unsubscribe();
  }

  getProjects(ids: string[]): void {
    this.projects
      .find(
        { _id: { $in: ids } },
        {
          xfilter: { '_id->$in': 'oids' }
        }
      )
      .subscribe(({ data }) => {
        data.forEach(v => (this.projectDict[v._id] = v));
      });
  }

  restart(): void {
    this.imessages.updateRule(this.doc._id).subscribe(() => {
      this.message.success('Collector is enabled');
    });
    this.imessages.createMetrics(this.doc._id).subscribe(() => {
      this.message.success('Monitoring is enabled');
    });
  }

  openPublish(pid: string): void {
    this.modal.create<PublishComponent, PublishInput>({
      nzTitle: 'Publish',
      nzContent: PublishComponent,
      nzData: {
        topic: `${this.doc.topic}/${pid}`
      },
      nzWidth: 640
    });
  }

  openLogs(id: string): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: LogsComponent,
      nzPlacement: 'bottom',
      nzContentParams: {
        topic: `${this.doc.topic}/${id}`
      },
      nzHeight: 640
    });
  }
}
