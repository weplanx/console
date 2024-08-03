import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AccTask } from '@common/models/acc-task';
import { AccTasksService } from '@common/services/acc-tasks.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormComponent, FormInput } from './form/form.component';
import { SettingComponent } from './setting/setting.component';

@Component({
  standalone: true,
  imports: [ShareModule, FormComponent, SettingComponent],
  selector: 'app-admin-acc-tasks',
  templateUrl: './acc-tasks.component.html'
})
export class AccTasksComponent implements OnInit {
  model: WpxModel<AccTask> = this.wpx.setModel<AccTask>('acc_tasks', this.accTasks);
  syncing = false;

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService,
    private accTasks: AccTasksService
  ) {}

  ngOnInit(): void {
    this.model.ready().subscribe(() => {
      this.getData();
    });
  }

  getData(refresh = false): void {
    if (refresh) {
      this.model.page = 1;
    }
    this.model.fetch({}).subscribe(() => {
      console.debug('fetch:ok');
    });
  }

  openForm(doc?: AnyDto<AccTask>): void {
    this.modal.create<FormComponent, FormInput>({
      nzTitle: !doc ? 'Create' : `Modify(${doc.source})`,
      nzContent: FormComponent,
      nzData: {
        doc
      },
      nzOnOk: () => {
        this.getData(true);
      }
    });
  }

  openSetting(): void {
    this.modal.create<SettingComponent>({
      nzTitle: 'Setting',
      nzContent: SettingComponent
    });
  }

  sync(): void {
    this.syncing = true;
    this.accTasks.invoke().subscribe(data => {
      this.message.success(`Synchronization to be completed in ${formatDate(data.date, 'medium', 'en-US')}`);
      this.syncing = false;
    });
  }

  delete(doc: AnyDto<AccTask>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: doc.source,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.accTasks.delete(doc._id).subscribe(() => {
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
        this.accTasks
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
