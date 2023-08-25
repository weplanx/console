import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, switchMap, timer } from 'rxjs';

import { Project } from '@common/models/project';
import { Schedule } from '@common/models/schedule';
import { States, Workflow } from '@common/models/workflow';
import { ProjectsService } from '@common/services/projects.service';
import { SchedulesService } from '@common/services/schedules.service';
import { WorkflowsService } from '@common/services/workflows.service';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ControlsComponent } from './controls/controls.component';
import { FormComponent, ModalData } from './form/form.component';
import { SchedulesComponent } from './schedules/schedules.component';

@Component({
  selector: 'app-admin-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit, OnDestroy {
  model!: WpxModel<Workflow>;
  projectDict: Record<string, AnyDto<Project>> = {};
  scheduleDict: Record<string, AnyDto<Schedule>> = {};
  statesDict: States = {};

  private refresh!: Subscription;

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService,
    private workflows: WorkflowsService,
    private projects: ProjectsService,
    private scheudles: SchedulesService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.model = this.wpx.setModel<Workflow>('workflows', this.workflows);
    this.model.ready().subscribe(() => {
      this.getData(true);
      this.refresh = timer(0, 1000)
        .pipe(switchMap(() => this.workflows.states(this.model.data().map(v => v._id))))
        .subscribe(data => {
          this.statesDict = data;
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
    this.model.fetch({}).subscribe(({ data }) => {
      console.debug('fetch', data);
      this.getProjects(data.map(v => v.project));
      this.getSchedules(data.filter(v => v.schedule).map(v => v.schedule!.schedule_id));
    });
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

  getSchedules(ids: string[]): void {
    this.scheudles
      .find(
        { _id: { $in: ids } },
        {
          xfilter: { '_id->$in': 'oids' }
        }
      )
      .subscribe(({ data }) => {
        data.forEach(v => (this.scheduleDict[v._id] = v));
      });
  }

  openForm(doc?: AnyDto<Workflow>): void {
    this.modal.create<FormComponent, ModalData>({
      nzTitle: !doc ? '创建' : `编辑【${doc.name}】`,
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

  openSchedules(): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: SchedulesComponent,
      nzWidth: 800
    });
  }

  openControls(doc: AnyDto<Workflow>): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: ControlsComponent,
      nzContentParams: {
        doc,
        updated: () => {
          this.getData();
        }
      },
      nzWidth: 640
    });
  }

  sync(doc: AnyDto<Workflow>): void {
    this.workflows.sync(doc._id).subscribe(() => {
      this.message.success(`触发事件已同步`);
    });
  }

  delete(doc: AnyDto<Workflow>): void {
    this.modal.confirm({
      nzTitle: `您确定要删除【${doc.name}】?`,
      nzOkText: `是的`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const del = this.workflows.delete(doc._id);
        if (doc.schedule) {
          this.scheudles
            .revoke(doc.schedule.schedule_id, doc._id)
            .pipe(switchMap(() => del))
            .subscribe(() => {
              this.message.success(`数据删除成功`);
              this.getData(true);
            });
        } else {
          del.subscribe(() => {
            this.message.success(`数据删除成功`);
            this.getData(true);
          });
        }
      },
      nzCancelText: `再想想`
    });
  }
}