import { Component, Input, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';

import { Endpoint } from '@common/models/endpoint';
import { EndpointsService } from '@common/services/endpoints.service';
import { WorkflowsService } from '@common/services/workflows.service';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-endpoints-schedule',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {
  @Input({ required: true }) doc!: AnyDto<Endpoint>;

  items: string[] = [];
  exists = new Set<string>();

  constructor(
    private endpoints: EndpointsService,
    private workflows: WorkflowsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.endpoints
      .scheduleKeys(this.doc._id)
      .pipe(
        switchMap(data => {
          this.items = [...data];
          return this.workflows.find(
            { _id: { $in: this.items } },
            {
              xfilter: { '_id->$in': 'oids' },
              keys: ['_id']
            }
          );
        })
      )
      .subscribe(({ data }) => {
        this.exists.clear();
        data.forEach(v => this.exists.add(v._id));
      });
  }

  stopJob(key: string): void {
    this.endpoints.scheduleRevoke(this.doc._id, key).subscribe(() => {
      this.getData();
    });
  }
}
