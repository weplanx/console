import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID, Optional } from '@angular/core';
import { AsyncSubject, fromEvent, map, Observable } from 'rxjs';

import { Any, WpxImageInfo, R, UploadOption, TransactionResult } from './types';
import { WpxApi } from './utils/api';
import { WpxModel } from './utils/model';
import { WpxStoreService } from './wpx-store.service';

@Injectable({
  providedIn: 'root'
})
export class WpxService {
  assets = '/assets';
  upload: AsyncSubject<UploadOption> = new AsyncSubject();
  scripts = new Map<string, AsyncSubject<void>>();

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    @Optional() @Inject(DOCUMENT) private document: Document,
    @Optional() private platform: Platform,
    @Optional() private http: HttpClient,
    @Optional() private store: WpxStoreService
  ) {}

  setAssets(v: string): void {
    this.assets = v;
  }

  setUpload(v: UploadOption): void {
    this.upload.next(v);
    this.upload.complete();
  }

  setModel<T>(key: string, api: WpxApi<T>): WpxModel<T> {
    return new WpxModel<T>(`models:${key}`, this.store, api);
  }

  setLocale(id: string): void {
    if (!this.platform.isBrowser) {
      return;
    }
    const { origin, hash } = this.document.location;
    this.document.location = `${origin}/${id}${hash}`;
  }

  private createScript(url: string): HTMLScriptElement | void {
    const script = this.document.createElement('script');
    script.src = url;
    script.async = true;
    this.document.body.append(script);
    return script;
  }

  loadScript(key: string, url: string, plugins: string[]): void {
    if (!this.platform.isBrowser) {
      return;
    }
    if (this.document.querySelector(`script[src='${url}']`)) {
      return;
    }
    const script = this.createScript(url);
    const async: AsyncSubject<void> = new AsyncSubject();
    this.scripts.set(key, async);
    for (const plugin of plugins) {
      this.createScript(plugin);
    }
    if (script) {
      fromEvent(script, 'load').subscribe(() => {
        async.next();
        async.complete();
      });
    }
  }

  getValues(keys?: string[]): Observable<R> {
    let params = new HttpParams();
    keys?.forEach(value => {
      params = params.append('keys', value);
    });
    return this.http.get('values', { params });
  }

  setValues(update: R): Observable<R> {
    return this.http.patch('values', { update });
  }

  deleteValue(key: string): Observable<R> {
    return this.http.delete(`values/${key}`);
  }

  transaction(): Observable<TransactionResult> {
    return this.http.post<TransactionResult>(`db/transaction`, {});
  }

  commit(txn: string): Observable<void> {
    return this.http.post<void>(`db/commit`, { txn });
  }

  cosPresigned(): Observable<R> {
    return this.http.get(`tencent/cos_presigned`);
  }

  cosImageInfo(url: string): Observable<WpxImageInfo> {
    return this.http.get<Any>(`tencent/cos_image_info`, { params: { url } }).pipe(
      map(v => {
        v.size = parseInt(v.size);
        v.height = parseInt(v.height);
        v.width = parseInt(v.width);
        v.format = v.format === 'unknown' ? 'avif' : v.format;
        return v;
      })
    );
  }
}
