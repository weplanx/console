import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Cluster, ClusterInfo } from '@common/models/cluster';
import { ClustersService } from '@common/services/clusters.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DetailComponent } from './detail/detail.component';
import { FormComponent, FormInput } from './form/form.component';

@Component({
  standalone: true,
  imports: [ShareModule, DetailComponent, FormComponent],
  selector: 'app-admin-clusters',
  templateUrl: './clusters.component.html'
})
export class ClustersComponent implements OnInit {
  model: WpxModel<Cluster> = this.wpx.setModel<Cluster>('clusters', this.clusters);
  infos: Record<string, ClusterInfo> = {};
  kind: Record<string, string> = {
    kubernetes: 'Kubernetes',
    agent: 'Agent'
  };

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService,
    public clusters: ClustersService,
    private router: Router,
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
    this.model.fetch({}).subscribe(({ data }) => {
      data.forEach(value => this.getInfo(value));
    });
  }

  getInfo(value: AnyDto<Cluster>): void {
    this.clusters.getInfo(value._id).subscribe(data => {
      this.infos[value._id] = data;
    });
  }

  open(context: string): void {
    this.router.navigate(['/admin', 'clusters', context, 'nodes']);
  }

  openDetail(doc: AnyDto<Cluster>): void {
    this.drawer.create({
      nzClosable: false,
      nzContent: DetailComponent,
      nzContentParams: {
        data: doc
      },
      nzWidth: 1200
    });
  }

  openForm(doc?: AnyDto<Cluster>): void {
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

  delete(doc: AnyDto<Cluster>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: doc.name,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.clusters.delete(doc._id).subscribe(() => {
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
        this.clusters
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
