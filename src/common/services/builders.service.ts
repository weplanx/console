import { Injectable } from '@angular/core';
import { Observable, Subject, switchMap, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { Builder, Field } from '@common/models/builder';
import { Any, AnyDto, Filter, FindResult, R, WpxApi, XFilter } from '@weplanx/ng';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Injectable({ providedIn: 'root' })
export class BuildersService extends WpxApi<Builder> {
  protected override collection = 'builders';
  dict: Record<string, AnyDto<Builder>> = {};
  updated = new Subject<string>();

  getNzTreeNodeOptions(
    pipe: (val: AnyDto<Builder>) => NzTreeNodeOptions,
    filter: Filter<Builder> = {},
    xfilter?: XFilter
  ): Observable<NzTreeNodeOptions[]> {
    return this.find(filter, { pagesize: 1000, sort: { sort: 1 }, xfilter }).pipe(
      map(({ data }) => {
        const nodes: NzTreeNodeOptions[] = [];
        const nodeDict: Record<string, NzTreeNodeOptions> = {};
        data.forEach(v => {
          this.dict[v._id] = v;
          nodeDict[v._id] = pipe(v);
        });
        data.forEach(v => {
          const options = nodeDict[v._id];
          if (!v.parent) {
            nodes.push(options);
          } else {
            if (nodeDict[v.parent]) {
              if (!nodeDict[v.parent]['children']) {
                nodeDict[v.parent].children = [];
              }
              nodeDict[v.parent].children?.push(options);
              nodeDict[v.parent].isLeaf = false;
            }
          }
        });
        return nodes;
      })
    );
  }

  existsSchemaKey(key: string): Observable<Any> {
    return timer(500).pipe(
      switchMap(() => this.exists({ 'schema.key': key })),
      map(v => (v ? { error: true, duplicated: v } : null))
    );
  }

  addSchemaField(id: string, data: Field): Observable<R> {
    return this.updateById(id, {
      $push: { 'schema.fields': data }
    });
  }

  updateSchemaField(id: string, key: string, data: Field): Observable<R> {
    return this.updateById(
      id,
      {
        $set: {
          'schema.fields.$[i]': data
        }
      },
      { arrayFilters: [{ 'i.key': key }] }
    );
  }

  deleteSchemaField(id: string, key: string): Observable<R> {
    return this.updateById(id, { $pull: { 'schema.fields': { key } } });
  }

  sortSchemaFields(id: string, keys: string[]): Observable<R> {
    return this.http.post(`${this.collection}/sort_fields`, { id, keys });
  }

  getRefs(): Observable<FindResult<Builder>> {
    return this.find(
      { kind: 'collection', schema: { $exists: true } },
      {
        pagesize: 1000,
        keys: ['_id', 'name', 'schema']
      }
    );
  }
}
