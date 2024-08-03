import { Component, OnInit } from '@angular/core';

import { ProjectComponent, ProjectInput } from '@common/components/project/project.component';
import { Cluster } from '@common/models/cluster';
import { Project } from '@common/models/project';
import { ClustersService } from '@common/services/clusters.service';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { AnyDto, WpxModel, WpxService } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AuthorizationComponent } from './authorization/authorization.component';
import { ExpirePipe } from './expire.pipe';

@Component({
  standalone: true,
  imports: [ShareModule, AuthorizationComponent, ExpirePipe],
  selector: 'app-admin-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  model: WpxModel<Project> = this.wpx.setModel<Project>('projects', this.projects);
  clusterDict: Record<string, AnyDto<Cluster>> = {};

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService,
    private projects: ProjectsService,
    private clusters: ClustersService
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
      this.getClusters(
        this.model
          .data()
          .filter(v => v.cluster)
          .map(v => v.cluster!)
      );
    });
  }

  getClusters(ids: string[]): void {
    this.clusters
      .find(
        {
          _id: { $in: ids }
        },
        {
          xfilter: { '_id->$in': 'oids' }
        }
      )
      .subscribe(({ data }) => {
        data.forEach(v => (this.clusterDict[v._id] = v));
      });
  }

  openForm(doc?: AnyDto<Project>): void {
    this.modal.create<ProjectComponent, ProjectInput>({
      nzTitle: !doc ? 'Create' : `Modify(${doc.name})`,
      nzContent: ProjectComponent,
      nzWidth: 800,
      nzData: {
        doc
      },
      nzOnOk: () => {
        this.getData(true);
      }
    });
  }

  openAuthorization(doc: AnyDto<Project>): void {
    this.modal.create<AuthorizationComponent, AnyDto<Project>>({
      nzTitle: `OpenAPI Details`,
      nzContent: AuthorizationComponent,
      nzWidth: 600,
      nzData: doc,
      nzMaskClosable: true,
      nzOkText: null,
      nzFooter: null
    });
  }

  delete(doc: AnyDto<Project>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: doc.name,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.projects.delete(doc._id).subscribe(() => {
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
        this.projects
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
