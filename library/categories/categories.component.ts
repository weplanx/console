import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Any, AnyDto, WpxModule } from '@weplanx/ng';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { WpxCategoriesService } from './categories.service';
import { FormComponent, FormInput } from './form/form.component';
import { WpxCategory } from './types';

@Component({
  standalone: true,
  imports: [WpxModule, DragDropModule, FormComponent],
  selector: 'wpx-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WpxCategoriesComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WpxCategoriesComponent implements ControlValueAccessor, OnInit {
  @Input({ required: true }) wpxType!: string;

  value: string[] = [];
  items: AnyDto<WpxCategory>[] = [];
  loading = false;
  actived?: AnyDto<WpxCategory>;
  panel = false;

  private onChange?: (value: string[]) => void;
  private onTouched?: () => void;

  constructor(
    private categories: WpxCategoriesService,
    private modal: NzModalService,
    private contextMenu: NzContextMenuService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  registerOnChange(fn: Any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Any): void {
    this.onTouched = fn;
  }

  writeValue(data: Any): void {
    this.value = data ?? [];
  }

  update(value: string[]): void {
    this.onChange!(value);
  }

  getData(): void {
    this.loading = true;
    this.categories
      .find(
        { type: this.wpxType },
        {
          pagesize: 1000,
          sort: { sort: 1 }
        }
      )
      .subscribe(({ data }) => {
        this.items = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  openPanel(): void {
    this.panel = true;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.categories
      .sort(
        'sort',
        this.items.map(v => v._id)
      )
      .subscribe(() => {
        this.getData();
        this.message.success(`Update successful`);
      });
  }

  closePanel(): void {
    this.panel = false;
  }

  openMenu($event: MouseEvent, menu: NzDropdownMenuComponent, data: AnyDto<WpxCategory>): void {
    this.actived = data;
    this.contextMenu.create($event, menu);
  }

  openForm(doc?: AnyDto<WpxCategory>): void {
    this.modal.create<FormComponent, FormInput>({
      nzTitle: !doc ? `Create` : `Modify(${doc.name})`,
      nzContent: FormComponent,
      nzData: {
        type: this.wpxType,
        doc
      },
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  delete(data: AnyDto<WpxCategory>): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: data.name,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.categories.delete(data._id).subscribe(() => {
          this.getData();
          this.message.success(`Deletion successful`);
        });
      },
      nzCancelText: `Think again`
    });
  }
}
