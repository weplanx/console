import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';

import { AnyDto, Filter, WpxApi } from '@weplanx/ng';

import { WpxFile } from './types';

export class FilebrowserDataSource<T extends WpxFile> implements DataSource<AnyDto<T>[]> {
  private stream = new BehaviorSubject<AnyDto<T>[][]>([]);
  private disconnect$ = new Subject<void>();
  private indexs: Set<number> = new Set<number>();
  private cache: AnyDto<T>[][] = [[]];
  loading = false;
  total = 0;

  /**
   * Each list contains the number of cards
   */
  n = 0;
  page = 1;
  pagesize = 0;

  categories: string[] = [];
  searchText = '';
  selection = new Map<string, T>();

  constructor(private api: WpxApi<T>) {}

  connect(collectionViewer: CollectionViewer): Observable<AnyDto<T>[][]> {
    collectionViewer.viewChange.pipe(takeUntil(this.disconnect$)).subscribe(range => {
      const index = Math.floor((range.end * this.n) / this.pagesize) + 1;
      const max = Math.trunc(this.total / this.pagesize);
      if (this.indexs.has(index) || index > max) {
        return;
      }
      this.page = index;
      this.fetch(false);
    });
    return this.stream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  fetch(refresh = false): void {
    this.loading = true;

    if (refresh) {
      this.page = 1;
      this.cache = [[]];
      this.stream.next([]);
      this.indexs.clear();
      this.selection.clear();
    }

    const filter: Filter<T> = {};

    if (this.categories.length !== 0) {
      filter.categories = { $in: this.categories };
    }
    if (this.searchText !== '') {
      filter.name = { $regex: '^' + this.searchText };
    }

    this.api
      .find(filter, {
        xfilter: {
          'categories->$in': 'oids'
        },
        pagesize: this.pagesize,
        page: this.page
      })
      .subscribe(({ data, total }) => {
        this.total = total;
        let l = this.cache.length - 1;
        data.forEach(value => {
          if (this.cache[l].length === this.n) {
            l++;
          }
          if (!this.cache[l]) {
            this.cache[l] = [];
          }
          this.cache[l].push(value);
        });
        this.indexs.add(this.page);
        this.stream.next(this.cache);
        this.loading = false;
      });
  }

  setSelection(data: AnyDto<T>): void {
    this.selection.set(data._id, data);
  }

  removeSelection(id: string): void {
    this.selection.delete(id);
  }
}
