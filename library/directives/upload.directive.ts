import { Directive, Input } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';

import { NzUploadComponent, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';
import { ajax } from 'rxjs/internal/ajax/ajax';

import { Any } from '../types';
import { WpxService } from '../wpx.service';

@Directive({
  standalone: true,
  selector: 'nz-upload[wpxUpload]'
})
export class WpxUploadDirective {
  @Input() wpxExt?: string;

  private reqs: { [key: string]: Subscription } = {};

  constructor(wpx: WpxService, component: NzUploadComponent) {
    wpx.upload.subscribe(option => {
      component.nzName = 'file';
      component.nzShowUploadList = false;
      component.nzAction = option.url;
      component.nzSize = option.limit ?? 5120;
      switch (option.type) {
        case 'cos':
          component.nzData = (file: NzUploadFile): Observable<Any> =>
            wpx.cosPresigned().pipe(
              map(v => {
                v['Content-Type'] = file.type;
                file['key'] = v['key'];
                if (this.wpxExt) {
                  v['key'] = `${v['key']}.${this.wpxExt}`;
                }
                return v;
              })
            );
      }
      component.nzCustomRequest = (args: NzUploadXHRArgs): Subscription => {
        const formData = new FormData();
        if (args.data) {
          Object.keys(args.data).map(key => {
            formData.append(key, args.data![key]);
          });
        }
        formData.append(args.name!, args.postFile as Any);
        if (!args.headers) {
          args.headers = {};
        }
        if (args.headers['X-Requested-With'] !== null) {
          args.headers['X-Requested-With'] = `XMLHttpRequest`;
        } else {
          delete args.headers['X-Requested-With'];
        }

        return ajax({
          method: 'POST',
          url: args.action!,
          body: formData,
          includeUploadProgress: true,
          withCredentials: args.withCredentials,
          headers: args.headers
        }).subscribe({
          next: (res: AjaxResponse<Any>) => {
            if (res.type === 'upload_progress') {
              if (res.total > 0) {
                Reflect.set(res, 'percent', (res.loaded / res.total) * 100);
              }
              args.onProgress!(res, args.file);
            }
            if (res.type === 'download_load') {
              args.onSuccess!(res.responseHeaders, args.file, res.xhr);
            }
          },
          error: e => {
            this.abort(args.file);
            args.onError!(e, args.file);
          }
        });
      };
    });
  }

  private clean(uid: string): void {
    const req$ = this.reqs[uid];
    req$.unsubscribe();
    delete this.reqs[uid];
  }

  abort(file?: NzUploadFile): void {
    if (file) {
      this.clean(file && file.uid);
    } else {
      Object.keys(this.reqs).forEach(uid => this.clean(uid));
    }
  }
}
