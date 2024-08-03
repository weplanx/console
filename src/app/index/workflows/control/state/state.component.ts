import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, timer } from 'rxjs';

import { ScheduleState } from '@common/models/endpoint';
import { Workflow } from '@common/models/workflow';
import { EndpointsService } from '@common/services/endpoints.service';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';

import { LogsComponent } from '../logs/logs.component';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-index-workflows-control-state',
  templateUrl: './state.component.html'
})
export class StateComponent implements OnInit, OnDestroy {
  @Input({ required: true }) doc!: AnyDto<Workflow>;

  state?: ScheduleState;
  private refresh!: Subscription;

  constructor(
    private endpoints: EndpointsService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.endpoints.findById(this.doc.schedule!.ref).subscribe(data => {
      this.refresh = timer(0, 5000)
        .pipe(switchMap(() => this.endpoints.scheduleState(data.schedule!.node, this.doc._id)))
        .subscribe(data => {
          this.state = data;
        });
    });
  }

  ngOnDestroy(): void {
    this.refresh?.unsubscribe();
  }

  openLogs(index: number): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: LogsComponent,
      nzPlacement: 'bottom',
      nzContentParams: {
        doc: this.doc,
        index
      },
      nzHeight: 640
    });
  }
}
