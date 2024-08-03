import { Component, Input, OnInit } from '@angular/core';

import { Cluster, ClusterNode } from '@common/models/cluster';
import { ClustersService } from '@common/services/clusters.service';
import { ShareModule } from '@common/share.module';
import { Any, AnyDto } from '@weplanx/ng';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-admin-clusters-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  @Input({ required: true }) data!: AnyDto<Cluster>;

  index = 0;
  nodes: ClusterNode[] = [];
  ingresses: Any[] = [];

  constructor(private clusters: ClustersService) {}

  ngOnInit(): void {
    this.getNodes();
  }

  getNodes(): void {
    this.clusters.getNodes(this.data._id).subscribe(data => {
      this.nodes = [...data];
    });
  }
}
