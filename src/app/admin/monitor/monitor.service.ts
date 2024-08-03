import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ExporterName } from './types';

@Injectable()
export class MonitorService {
  interval$ = new BehaviorSubject<number>(60);
  date: Date[] = [];

  constructor(private http: HttpClient) {}

  setInterval(v: number): void {
    if (v !== 86400) {
      this.date = [];
    }
    this.interval$.next(v);
  }

  exporter<T>(name: ExporterName): Observable<T> {
    let params = new HttpParams();
    if (this.date.length !== 0) {
      params = params.set('dates', this.date.map(v => Math.trunc(v.getTime() / 1000)).join(','));
    }
    return this.http.get<T>(`monitor/${name}`, {
      params
    });
  }
}
