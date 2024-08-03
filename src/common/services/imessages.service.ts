import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EmqxNode, Imessage, Info } from '@common/models/imessage';
import { Any, WpxApi } from '@weplanx/ng';

@Injectable({ providedIn: 'root' })
export class ImessagesService extends WpxApi<Imessage> {
  protected override collection = 'imessages';

  getNodes(): Observable<EmqxNode[]> {
    return this.http.get<EmqxNode[]>(`${this.collection}/nodes`);
  }

  updateRule(id: string): Observable<Any> {
    return this.http.put(`${this.collection}/${id}/rule`, {});
  }

  deleteRule(id: string): Observable<Any> {
    return this.http.delete(`${this.collection}/${id}/rule`);
  }

  getMetrics(id: string): Observable<Info[]> {
    return this.http.get<Info[]>(`${this.collection}/${id}/metrics`);
  }

  createMetrics(id: string): Observable<Any> {
    return this.http.put(`${this.collection}/${id}/metrics`, {});
  }

  deleteMetrics(id: string): Observable<Any> {
    return this.http.delete(`${this.collection}/${id}/metrics`);
  }

  publish(topic: string, payload: Any): Observable<Any> {
    return this.http.post(`${this.collection}/publish`, { topic, payload });
  }
}
