import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { Any, AnyDto, Filter, WpxApi, WpxModule, WpxService } from '@weplanx/ng';
import { WpxCategoriesComponent } from '@weplanx/ng/categories';
import { Transport, WpxUploadTransportComponent } from '@weplanx/ng/upload';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzImageModule, NzImageService } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { CategoriesComponent, CategoriesInput } from './categories/categories.component';
import { FilebrowserDataSource } from './filebrowser.data-source';
import { FormComponent, FormInput } from './form/form.component';
import { PictureComponent, PictureInput } from './picture/picture.component';
import { OPTION } from './provide';
import { Option, WpxFile, WpxFileType } from './types';
import { VideoComponent, VideoInput } from './video/video.component';

export interface WpxFilebrowserInput<T> {
  api: WpxApi<T>;
  type: WpxFileType;
  fallback: string;
}

@Component({
  standalone: true,
  imports: [WpxModule, NzImageModule, ScrollingModule, WpxUploadTransportComponent, WpxCategoriesComponent],
  selector: 'wpx-filebrowser',
  templateUrl: './filebrowser.component.html',
  styleUrl: './filebrowser.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxFilebrowserComponent<T extends WpxFile> implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NzCardComponent, { read: ElementRef, static: true }) card!: ElementRef;
  @ViewChild(WpxCategoriesComponent) categories!: WpxCategoriesComponent;
  @ViewChild('titleRef', { static: true }) titleRef!: TemplateRef<Any>;
  @ViewChild('extraRef', { static: true }) extraRef!: TemplateRef<Any>;

  @Input({ required: true }) wpxApi!: WpxApi<T>;
  @Input({ required: true }) wpxType!: WpxFileType;
  @Input({ required: true }) wpxFallback!: string;
  @Input() wpxForm?: (doc: AnyDto<T>) => void;
  @Input() wpxTitle?: TemplateRef<void>;
  @Input() wpxExtra?: TemplateRef<void>;

  accept: string[] = [];
  ext!: string;

  ds!: FilebrowserDataSource<T>;
  actived?: AnyDto<T>;

  private resizeObserver!: ResizeObserver;

  constructor(
    @Inject(OPTION) public option: Option,
    private wpx: WpxService,
    private image: NzImageService,
    private message: NzMessageService,
    private modal: NzModalService,
    private contextMenu: NzContextMenuService,
    private cdr: ChangeDetectorRef,
    @Optional() public modalRef: NzModalRef,
    @Optional() @Inject(NZ_MODAL_DATA) public data: WpxFilebrowserInput<T>
  ) {}

  ngOnInit(): void {
    if (this.modalRef) {
      this.wpxApi = this.data.api;
      this.wpxType = this.data.type;
      this.wpxFallback = this.data.fallback;
    }
    this.ds = new FilebrowserDataSource<T>(this.wpxApi);
    switch (this.wpxType) {
      case 'picture':
        this.ext = 'image';
        this.accept = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif', 'image/webp', 'image/avif'];
        break;
      case 'video':
        this.ext = 'video';
        this.accept = ['video/mp4'];
        break;
    }
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const n = width >= 1400 ? 6 : 4;
        if (this.ds.n !== n) {
          this.ds.n = n;
          this.ds.pagesize = n * 10;
          this.ds.fetch(true);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.card.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  upload(data: Transport[]): void {
    const docs: T[] = data.map<T>(
      v =>
        ({
          name: v.name,
          url: Reflect.get(v.file.originFileObj as File, 'key') as string,
          categories: [] as string[]
        }) as T
    );
    this.wpxApi.bulkCreate(docs).subscribe(() => {
      this.ds.fetch(true);
    });
  }

  previewPicture(data: AnyDto<T>): void {
    let url = `${this.wpx.assets}/${data.url}`;
    if (data.query) {
      url += `?${data.query}`;
    }
    this.image.preview([{ src: url, alt: data.name }]);
  }

  previewPoster(data: AnyDto<T>): void {
    this.image.preview(
      [0, 1, 2].map(n => ({
        src: `${this.wpx.assets}/${data.url}_${n}`
      }))
    );
  }

  openActions($event: MouseEvent, menu: NzDropdownMenuComponent, data: AnyDto<T>): void {
    this.actived = data;
    this.contextMenu.create($event, menu);
  }

  openForm(doc: AnyDto<T>): void {
    if (!this.wpxForm) {
      this.modal.create<FormComponent, FormInput>({
        nzTitle: `Modify(${doc.name})`,
        nzContent: FormComponent,
        nzData: {
          doc,
          api: this.wpxApi as WpxApi<WpxFile>,
          categories: this.categories.items
        },
        nzOnOk: () => {
          this.cdr.detectChanges();
        }
      });
    } else {
      this.wpxForm(doc);
    }
  }

  openPicture(doc: AnyDto<T>): void {
    this.modal.create<PictureComponent, PictureInput<T>>({
      nzTitle: `Process(${doc.name})`,
      nzWidth: 960,
      nzContent: PictureComponent,
      nzData: {
        doc,
        api: this.wpxApi
      },
      nzOnOk: () => {
        this.cdr.detectChanges();
      }
    });
  }

  openVideo(doc: AnyDto<T>): void {
    this.modal.create<VideoComponent, VideoInput>({
      nzTitle: doc.name,
      nzWidth: 960,
      nzContent: VideoComponent,
      nzData: {
        url: doc.url
      },
      nzFooter: null
    });
  }

  delete(data: AnyDto<T>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: data.name,
      nzWidth: 640,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.wpxApi.delete(data._id).subscribe(() => {
          this.message.success(`Deletion successful`);
          this.ds.removeSelection(data._id);
          data.deleted = true;
          this.cdr.detectChanges();
        });
      },
      nzCancelText: `Think again`
    });
  }

  bulkDelete(): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete these items`,
      nzWidth: 640,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.wpxApi
          .bulkDelete(
            {
              _id: { $in: [...this.ds.selection.keys()] }
            } as Filter<T>,
            {
              xfilter: {
                '_id->$in': 'oids'
              }
            }
          )
          .subscribe(() => {
            this.ds.selection.forEach(value => {
              value.deleted = true;
            });
            this.ds.selection.clear();
            this.cdr.detectChanges();
            this.message.success(`Deletion successful`);
          });
      },
      nzCancelText: `Think again`
    });
  }

  bulkCategories(): void {
    this.modal.create<CategoriesComponent, CategoriesInput>({
      nzTitle: `Category to`,
      nzContent: CategoriesComponent,
      nzData: {
        docs: [...this.ds.selection.values()] as AnyDto<T>[],
        api: this.wpxApi as WpxApi<WpxFile>,
        categories: this.categories.items
      },
      nzOnOk: () => {
        this.ds.selection.clear();
        this.cdr.detectChanges();
      }
    });
  }
}
