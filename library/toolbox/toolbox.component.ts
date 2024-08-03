import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';

import { Any, WpxModel } from '@weplanx/ng';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, NzButtonModule, NzIconModule, NzToolTipModule, NzSpaceModule],
  selector: 'wpx-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxToolboxComponent<T> implements OnDestroy {
  @ViewChild('searchBtnRef') searchBtnRef!: TemplateRef<Any>;
  @ViewChild('searchContentRef') searchContentRef!: TemplateRef<Any>;

  @Input({ required: true }) wpxModel!: WpxModel<T>;
  @Input() wpxSearchHeight = 340;
  @Input() wpxSearchForm?: FormGroup;
  @Input() wpxSearchTitle?: TemplateRef<Any>;
  @Output() wpxClear = new EventEmitter<void>();
  @Output() wpxRefresh = new EventEmitter<void>();

  constructor(private drawer: NzDrawerService) {}

  ngOnDestroy(): void {
    this.close();
  }

  open(): void {
    if (this.wpxModel.advanced()) {
      this.close();
      return;
    }
    this.wpxModel.advanced.set(
      this.drawer.create({
        nzTitle: !this.wpxSearchTitle ? 'Advanced Search' : this.wpxSearchTitle,
        nzExtra: this.searchBtnRef,
        nzContent: this.searchContentRef,
        nzHeight: this.wpxSearchHeight,
        nzMask: false,
        nzMaskClosable: false,
        nzPlacement: 'bottom',
        nzClosable: false
      })
    );
  }

  close(): void {
    this.wpxModel.advanced()?.close();
    this.wpxModel.advanced.set(null);
  }

  clear(): void {
    this.wpxModel.searchText = '';
    this.wpxModel.keywords = [];
    this.wpxModel.page = 1;
    this.wpxClear.emit();
  }

  refresh(): void {
    this.wpxModel.page = 1;
    this.wpxRefresh.emit();
  }
}
