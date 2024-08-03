import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer } from 'rxjs';

import { Endpoint } from '@common/models/endpoint';
import { EndpointsService } from '@common/services/endpoints.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormComponent, FormInput } from './form/form.component';
import { ScheduleComponent } from './schedule/schedule.component';

@Component({
  standalone: true,
  imports: [ShareModule, FormComponent, ScheduleComponent],
  selector: 'app-admin-endpoints',
  templateUrl: './endpoints.component.html'
})
export class EndpointsComponent implements OnInit, OnDestroy {
  model: WpxModel<Endpoint> = this.wpx.setModel<Endpoint>('endpoints', this.endpoints);
  kind: Record<string, string> = {
    schedule: 'Schedule',
    emqx: 'EMQX'
  };

  pingDict: Record<string, boolean> = {};
  private refresh!: Subscription;

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private endpoints: EndpointsService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.model.ready().subscribe(() => {
      this.getData();
      this.refresh = timer(500, 5000)
        .pipe(
          switchMap(() =>
            this.endpoints.schedulePing(
              this.model
                .data()
                .filter(v => v.kind === 'schedule')
                .map(v => v.schedule!.node)
            )
          )
        )
        .subscribe(data => {
          this.pingDict = data;
        });
    });
  }

  ngOnDestroy(): void {
    this.refresh.unsubscribe();
  }

  getData(refresh = false): void {
    if (refresh) {
      this.model.page = 1;
    }
    this.model.fetch({}).subscribe(() => {});
  }

  open(context: string): void {
    this.router.navigate(['/admin', 'clusters', context, 'nodes']);
  }

  openForm(doc?: AnyDto<Endpoint>): void {
    this.modal.create<FormComponent, FormInput>({
      nzTitle: !doc ? 'Create' : `Modify(${doc.name})`,
      nzWidth: 640,
      nzContent: FormComponent,
      nzData: {
        doc
      },
      nzOnOk: () => {
        this.getData(true);
      }
    });
  }

  openSchedule(doc: AnyDto<Endpoint>): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: ScheduleComponent,
      nzContentParams: {
        doc
      },
      nzWidth: 800
    });
  }

  delete(doc: AnyDto<Endpoint>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: doc.name,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.endpoints.delete(doc._id).subscribe(() => {
          this.message.success(`Deletion successful`);
          this.getData(true);
        });
      },
      nzCancelText: `Think again`
    });
  }

  bulkDelete(): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete these items?`,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.endpoints
          .bulkDelete(
            {
              _id: { $in: [...this.model.selection.keys()] }
            },
            {
              xfilter: {
                '_id->$in': 'oids'
              }
            }
          )
          .subscribe(() => {
            this.message.success(`Deletion successful`);
            this.getData(true);
            this.model.setCurrentSelections(false);
          });
      },
      nzCancelText: `Think again`
    });
  }
}
