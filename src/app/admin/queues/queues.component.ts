import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';

import { Queue } from '@common/models/queue';
import { QueuesService } from '@common/services/queues.service';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormComponent, FormInput } from './form/form.component';

@Component({
  selector: 'app-admin-queues',
  templateUrl: './queues.component.html'
})
export class QueuesComponent implements OnInit {
  model!: WpxModel<Queue>;

  constructor(
    private wpx: WpxService,
    private queues: QueuesService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.model = this.wpx.setModel('queues', this.queues);
    this.model.ready().subscribe(() => {
      this.getData(true);
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

  openForm(doc?: AnyDto<Queue>): void {
    this.modal.create<FormComponent, FormInput>({
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

  sync(doc: AnyDto<Queue>): void {
    this.queues.sync(doc._id).subscribe(() => {
      this.message.success(`队列配置已同步`);
    });
  }

  delete(doc: AnyDto<Queue>): void {
    this.modal.confirm({
      nzTitle: `您确定要删除【${doc.name}】?`,
      nzOkText: `是的`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.queues
          .destroy([doc._id])
          .pipe(switchMap(() => this.queues.delete(doc._id)))
          .subscribe(() => {
            this.message.success(`数据删除成功`);
            this.getData(true);
          });
      },
      nzCancelText: `再想想`
    });
  }

  bulkDelete(): void {
    this.modal.confirm({
      nzTitle: `您确定删除这些队列吗？`,
      nzOkText: `是的`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const ids = [...this.model.selection.keys()];
        this.queues
          .destroy(ids)
          .pipe(
            switchMap(() =>
              this.queues.bulkDelete(
                {
                  _id: { $in: ids }
                },
                {
                  xfilter: {
                    '_id->$in': 'oids'
                  }
                }
              )
            )
          )
          .subscribe(() => {
            this.message.success(`数据删除成功`);
            this.getData(true);
            this.model.setCurrentSelections(false);
          });
      },
      nzCancelText: `再想想`
    });
  }
}
