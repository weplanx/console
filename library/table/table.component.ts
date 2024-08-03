import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';

import { Any, AnyDto, WpxModel, WpxModule, WpxStoreService } from '@weplanx/ng';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzResizableModule, NzResizeEvent } from 'ng-zorro-antd/resizable';
import { NzTableComponent } from 'ng-zorro-antd/table';

import { Column, Preferences, Scroll, WpxColumn } from './types';

@Component({
  standalone: true,
  imports: [WpxModule, NzResizableModule, DragDropModule],
  selector: 'wpx-table',
  exportAs: 'wpxTable',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxTableComponent<T> implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) wpxModel!: WpxModel<T>;
  @Input({ required: true }) wpxColumns!: WpxColumn<T>[];
  @Input({ required: true }) wpxAction!: TemplateRef<{ $implicit: AnyDto<T> }>;
  @Input() wpxTitle?: TemplateRef<void>;
  @Input() wpxExtra?: TemplateRef<void>;
  @Input() wpxX?: string;
  @Input() wpxBodyStyle: NgStyleInterface | null = { height: 'calc(100% - 64px)' };
  @Output() wpxChange = new EventEmitter<void>();

  @ViewChild(NzTableComponent, { read: ElementRef, static: true }) basicTableRef!: ElementRef;
  @ViewChild('settingsExtraRef') settingsExtraRef!: TemplateRef<Any>;
  @ViewChild('settingsContentRef') settingsContentRef!: TemplateRef<Any>;

  columns: Column<T>[] = [];
  scroll = signal<Scroll>({ y: '0px' });
  settings = signal<NzDrawerRef | null>(null);
  private resizeObserver!: ResizeObserver;

  constructor(
    private store: WpxStoreService,
    private drawer: NzDrawerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.get<Map<string, Preferences<T>>>(`${this.wpxModel.key}:preferences`).subscribe(data => {
      if (!data) {
        this.initColumns();
        return;
      }
      this.columns = [
        ...this.wpxColumns
          .map<Column<T>>(v => {
            const x = data.get(v.key as string);
            return {
              ...v,
              width: x?.width,
              display: x?.display,
              sort: x?.sort
            };
          })
          .sort((a, b) => (a.sort as number) - (b.sort as number))
      ];
    });
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.scroll.set({
          x: this.wpxX ?? width - 24 + 'px',
          y: height - 128 + 'px'
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.basicTableRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.closeSettings();
    this.resizeObserver.disconnect();
  }

  private initColumns(): void {
    this.columns = [
      ...this.wpxColumns.map<Column<T>>(v => ({
        ...v,
        display: true
      }))
    ];
  }

  clearSelections(): void {
    this.wpxModel.checked = false;
    this.wpxModel.indeterminate = false;
    this.wpxModel.selection.clear();
    this.cdr.detectChanges();
  }

  openSettings(): void {
    if (this.settings()) {
      this.closeSettings();
      return;
    }
    this.settings.set(
      this.drawer.create({
        nzTitle: `Table Style`,
        nzExtra: this.settingsExtraRef,
        nzContent: this.settingsContentRef,
        nzHeight: 200,
        nzMask: false,
        nzMaskClosable: false,
        nzPlacement: 'bottom',
        nzClosable: false
      })
    );
  }

  closeSettings(): void {
    this.settings()?.close();
    this.settings.set(null);
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    this.updatePreferences();
  }

  resizableChange(): void {
    this.cdr.detectChanges();
  }

  resize({ width }: NzResizeEvent, column: Column<T>): void {
    column.width = `${width}px`;
  }

  resizeEnd(): void {
    this.updatePreferences();
  }

  updatePreferences(): void {
    this.store
      .set<Map<string, Preferences<T>>>(
        `${this.wpxModel.key}:preferences`,
        new Map([
          ...this.columns.map<[string, Preferences<T>]>((value, index) => [
            value.key as string,
            {
              display: value.display,
              width: value.width,
              sort: index
            }
          ])
        ])
      )
      .subscribe(() => {
        this.cdr.detectChanges();
      });
  }

  initPreferences(): void {
    this.store.remove(`${this.wpxModel.key}:preferences`).subscribe(() => {
      this.initColumns();
      this.cdr.detectChanges();
    });
  }
}
