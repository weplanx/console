import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Cluster, ClusterInfo, ClusterNode } from '@common/models/cluster';
import { WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class ClustersService extends WpxApi<Cluster> {
  protected override collection = 'clusters';

  getInfo(id: string): Observable<ClusterInfo> {
    return this.http.get<ClusterInfo>(`clusters/${id}/info`);
  }

  getNodes(id: string): Observable<ClusterNode[]> {
    return this.http.get<ClusterNode[]>(`clusters/${id}/nodes`);
  }
}
