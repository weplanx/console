import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { toHttpParams } from './helper';
import {
  AnyDto,
  BulkDeleteOption,
  CreateOption,
  DeleteOption,
  Filter,
  FilterOption,
  FindByIdOption,
  FindOneOption,
  FindOption,
  FindResult,
  R,
  ReplaceOption,
  SortOption,
  Update,
  UpdateOneByIdOption,
  UpdateOption
} from '../types';

@Injectable()
export abstract class WpxApi<T> {
  protected collection = '';
  protected http = inject(HttpClient);

  create(doc: T, options?: CreateOption<T>): Observable<R> {
    return this.http.post(`db/${this.collection}/create`, {
      data: doc,
      xdata: options?.xdata,
      txn: options?.txn
    });
  }

  bulkCreate(docs: T[], options?: CreateOption<T>): Observable<R> {
    return this.http.post(`db/${this.collection}/bulk_create`, {
      data: docs,
      xdata: options?.xdata,
      txn: options?.txn
    });
  }

  size(filter: Filter<T>, options?: FilterOption<T>): Observable<number> {
    return this.http
      .post(
        `db/${this.collection}/size`,
        {
          filter,
          xfilter: options?.xfilter
        },
        { observe: 'response' }
      )
      .pipe(
        map(response => {
          const total = response.headers.get('x-total');
          if (!total) {
            return 0;
          }
          return Number(total);
        })
      );
  }

  exists(filter: Filter<T>, options?: FilterOption<T>): Observable<boolean> {
    return this.size(filter, options).pipe(map(v => v !== 0));
  }

  find(filter: Filter<T>, options?: FindOption<T>): Observable<FindResult<T>> {
    return this.http
      .post<Array<AnyDto<T>>>(
        `db/${this.collection}/find`,
        {
          filter,
          xfilter: options?.xfilter ?? {}
        },
        {
          observe: 'response',
          headers: new HttpHeaders({
            'x-page': options?.page ?? 1,
            'x-pagesize': options?.pagesize ?? 50
          }),
          params: toHttpParams(options)
        }
      )
      .pipe(
        map(response => ({
          data: response.body ?? [],
          total: parseInt(response.headers.get('x-total') ?? '0')
        }))
      );
  }

  findOne(filter: Filter<T>, options?: FindOneOption<T>): Observable<AnyDto<T>> {
    return this.http.post<AnyDto<T>>(
      `db/${this.collection}/find_one`,
      {
        filter,
        xfilter: options?.xfilter
      },
      {
        params: toHttpParams(options)
      }
    );
  }

  findById(id: string, options?: FindByIdOption<T>): Observable<AnyDto<T>> {
    return this.http.get<AnyDto<T>>(`db/${this.collection}/${id}`, {
      params: toHttpParams(options)
    });
  }

  update(filter: Filter<T>, update: Update<T>, options?: UpdateOption<T>): Observable<R> {
    return this.http.post(`db/${this.collection}/update`, {
      filter,
      xfilter: options?.xfilter,
      data: update,
      xdata: options?.xdata,
      arrayFilters: options?.arrayFilters,
      txn: options?.txn
    });
  }

  updateById(id: string, update: Update<T>, options?: UpdateOneByIdOption<T>): Observable<R> {
    return this.http.patch(`db/${this.collection}/${id}`, {
      data: update,
      xdata: options?.xdata,
      arrayFilters: options?.arrayFilters,
      txn: options?.txn
    });
  }

  replace(id: string, doc: T, options?: ReplaceOption<T>): Observable<R> {
    return this.http.put(`db/${this.collection}/${id}`, {
      data: doc,
      xdata: options?.xdata,
      txn: options?.txn
    });
  }

  delete(id: string, options?: DeleteOption<T>): Observable<R> {
    const params = new HttpParams();
    if (options?.txn) {
      params.set('txn', options.txn);
    }
    return this.http.delete(`db/${this.collection}/${id}`, { params });
  }

  bulkDelete(filter: Filter<T>, options?: BulkDeleteOption<T>): Observable<R> {
    return this.http.post(`db/${this.collection}/bulk_delete`, {
      filter,
      xfilter: options?.xfilter,
      txn: options?.txn
    });
  }

  sort(key: string, values: string[], options?: SortOption<T>): Observable<R> {
    return this.http.post(`db/${this.collection}/sort`, {
      data: { key, values },
      txn: options?.txn
    });
  }
}
