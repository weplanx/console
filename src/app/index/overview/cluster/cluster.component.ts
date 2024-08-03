import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';

import { AppService } from '@app';
import { Cluster } from '@common/models/cluster';
import { Project } from '@common/models/project';
import { ClustersService } from '@common/services/clusters.service';
import { ProjectsService } from '@common/services/projects.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-index-overview-cluster',
  templateUrl: './cluster.component.html'
})
export class ClusterComponent implements OnInit {
  data: AnyDto<Project> = this.app.contextData!;
  form: FormGroup = this.fb.group({
    cluster: [null, [Validators.required]]
  });
  tips = {
    cluster: {
      default: {
        required: `Cluster cannot be empty`
      }
    }
  };

  clusters$ = new BehaviorSubject<string>('');
  clusterItems: AnyDto<Cluster>[] = [];

  constructor(
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private projects: ProjectsService,
    private clusters: ClustersService,
    private app: AppService
  ) {}

  ngOnInit(): void {
    this.form.patchValue(this.data);
    this.clusters$
      .asObservable()
      .pipe(debounceTime(500))
      .subscribe(v => {
        this.getClusters(v);
      });
  }

  getClusters(v: string): void {
    this.clusters.find({ name: { $regex: v } }).subscribe(({ data }) => {
      this.clusterItems = [...data];
    });
  }

  close(): void {
    this.modalRef.triggerCancel();
  }

  submit(data: Any): void {
    this.projects
      .updateById(
        this.data!._id,
        {
          $set: data
        },
        {
          xdata: {
            '$set->cluster': 'oid'
          }
        }
      )
      .subscribe(() => {
        this.message.success(`Update successful`);
        this.modalRef.triggerOk();
      });
  }
}
