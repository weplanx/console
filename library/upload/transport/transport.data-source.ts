import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Transport } from '../types';

export class TransportDataSource extends DataSource<Transport> {
  private stream = new BehaviorSubject<Transport[]>([]);
  private disconnect$ = new Subject<void>();

  connect(): Observable<Transport[]> {
    return this.stream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  set(v: Transport[]): void {
    this.stream.next(v);
  }
}
