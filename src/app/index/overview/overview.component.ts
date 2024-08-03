import { Component, OnInit } from '@angular/core';

import { AppService } from '@app';
import { ProjectComponent, ProjectInput } from '@common/components/project/project.component';
import { Cluster, ClusterInfo } from '@common/models/cluster';
import { Project, TenantsResult } from '@common/models/project';
import { ClustersService } from '@common/services/clusters.service';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { AnyDto } from '@weplanx/ng';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

import { ClusterComponent } from './cluster/cluster.component';
import { EntryComponent } from './entry/entry.component';

@Component({
  standalone: true,
  imports: [ShareModule, NzPopconfirmModule, NzAlertModule],
  selector: 'app-index-overview',
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {
  data: AnyDto<Project> = this.app.contextData!;
  tabIndex = 0;

  cluster?: AnyDto<Cluster>;
  clusterInfo?: ClusterInfo;
  tenants!: TenantsResult;

  private tenantsLoading?: string;

  constructor(
    public app: AppService,
    private modal: NzModalService,
    private clusters: ClustersService,
    private projects: ProjectsService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getCluster();
    this.getTenants();
  }

  refreshData(): void {
    this.app.fetchContextData().subscribe(data => {
      this.data = data;
    });
  }

  openForm(): void {
    this.modal.create<ProjectComponent, ProjectInput>({
      nzTitle: `Modify(${this.data.name})`,
      nzContent: ProjectComponent,
      nzWidth: 800,
      nzData: {
        doc: this.data
      },
      nzOnOk: () => {
        this.refreshData();
      }
    });
  }

  getTenants(): void {
    if (!this.data.cluster) {
      return;
    }
    this.projects.getTenants(this.data._id).subscribe(data => {
      this.tenants = data;
      if (!this.tenantsLoading) {
        const ref = this.message.loading(`Acquiring service information`, { nzDuration: 1000 });
        this.tenantsLoading = ref.messageId;
        ref.onClose.subscribe(() => {
          this.tenantsLoading = undefined;
        });
      }
    });
  }

  getCluster(): void {
    if (this.data.cluster) {
      this.clusters.findById(this.data.cluster).subscribe(data => {
        this.cluster = data;
      });
      this.clusters.getInfo(this.data.cluster).subscribe(data => {
        this.clusterInfo = data;
      });
    }
  }

  openCluster(): void {
    this.modal.create<ClusterComponent, AnyDto<Project>>({
      nzTitle: `Connect Cluster`,
      nzContent: ClusterComponent,
      nzOnOk: () => {
        this.app.fetchContextData().subscribe(data => {
          this.data = data;
          this.getCluster();
        });
      }
    });
  }

  deployNats(): void {
    this.projects.deployNats(this.data._id).subscribe(() => {
      this.message.success(`Configuring tenants, please refresh later...`);
    });
  }

  openEntry(): void {
    this.modal.create<EntryComponent>({
      nzTitle: `OpenAPI`,
      nzContent: EntryComponent,
      nzOnOk: () => {
        this.refreshData();
      }
    });
  }
}
