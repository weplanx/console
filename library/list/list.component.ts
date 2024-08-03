import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef
} from '@angular/core';

import { AnyDto, WpxModel, WpxModule } from '@weplanx/ng';
import { NgStyleInterface } from 'ng-zorro-antd/core/types';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  standalone: true,
  imports: [WpxModule, NzPaginationModule],
  selector: 'wpx-list',
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxListComponent<T> {
  @Input({ required: true }) wpxModel!: WpxModel<T>;
  @Input({ required: true }) wpxRender!: TemplateRef<{ $implicit: AnyDto<T> }>;
  @Input() wpxTitle?: TemplateRef<void>;
  @Input() wpxExtra?: TemplateRef<void>;
  @Input() wpxOffset = 0;
  @Input() wpxBodyStyle: NgStyleInterface | null = { height: 'calc(100% - 64px)' };
  @Input() wpxActions?: NzDropdownMenuComponent;

  @Output() wpxChange = new EventEmitter<void>();

  actived?: AnyDto<T>;

  constructor(
    private contextMenu: NzContextMenuService,
    private cdr: ChangeDetectorRef
  ) {}

  clearSelections(): void {
    this.wpxModel.checked = false;
    this.wpxModel.indeterminate = false;
    this.wpxModel.selection.clear();
    this.cdr.detectChanges();
  }

  openActions($event: MouseEvent, data: AnyDto<T>): void {
    if (this.wpxActions) {
      this.actived = data;
      this.contextMenu.create($event, this.wpxActions);
    }
  }
}
