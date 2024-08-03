import { Component, OnInit } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';

import { Imessage } from '@common/models/imessage';
import { ImessagesService } from '@common/services/imessages.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DetailComponent } from './detail/detail.component';
import { EmqxComponent } from './emqx/emqx.component';
import { FormComponent, FormInput } from './form/form.component';
import { LogsComponent } from './logs/logs.component';
import { PublishComponent, PublishInput } from './publish/publish.component';

@Component({
  standalone: true,
  imports: [ShareModule, FormComponent, DetailComponent, EmqxComponent, LogsComponent, PublishComponent],
  selector: 'app-admin-imessages',
  templateUrl: './imessages.component.html'
})
export class ImessagesComponent implements OnInit {
  model: WpxModel<Imessage> = this.wpx.setModel('imessages', this.imessages);

  constructor(
    private wpx: WpxService,
    private imessages: ImessagesService,
    private modal: NzModalService,
    private message: NzMessageService,
    private drawer: NzDrawerService
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
    this.model.fetch({}).subscribe();
  }

  openForm(doc?: AnyDto<Imessage>): void {
    this.modal.create<FormComponent, FormInput>({
      nzTitle: !doc ? 'Create' : `Modify(${doc.topic})`,
      nzContent: FormComponent,
      nzData: {
        doc
      },
      nzOnOk: () => {
        this.getData(true);
      }
    });
  }

  openEmqx(): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: EmqxComponent,
      nzWidth: 960
    });
  }

  openDetail(doc: AnyDto<Imessage>): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: DetailComponent,
      nzContentParams: {
        doc
      },
      nzWidth: 1200
    });
  }

  openPublish(): void {
    this.modal.create<PublishComponent, PublishInput>({
      nzTitle: 'Publish',
      nzContent: PublishComponent,
      nzWidth: 640
    });
  }

  delete(doc: AnyDto<Imessage>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: doc.topic,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        forkJoin([this.imessages.deleteRule(doc._id), this.imessages.deleteMetrics(doc._id)])
          .pipe(switchMap(() => this.imessages.delete(doc._id)))
          .subscribe(() => {
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
        const ids = [...this.model.selection.keys()];
        forkJoin([...ids.map(id => this.imessages.deleteRule(id)), ...ids.map(id => this.imessages.deleteMetrics(id))])
          .pipe(
            switchMap(() =>
              this.imessages.bulkDelete(
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
            this.message.success(`Deletion successful`);
            this.getData(true);
            this.model.setCurrentSelections(false);
          });
      },
      nzCancelText: `Think again`
    });
  }
}
