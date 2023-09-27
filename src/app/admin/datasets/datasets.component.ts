import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs';

import { Dataset } from '@common/models/dataset';
import { DatasetsService } from '@common/services/datasets.service';
import { WpxItems, WpxService } from '@weplanx/ng';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { ControlsComponent } from './controls/controls.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-admin-datasets',
  templateUrl: './datasets.component.html'
})
export class DatasetsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NzCardComponent, { read: ElementRef, static: true }) card!: ElementRef;

  items = new WpxItems<Dataset>('name');
  scroll = { x: '0px', y: '0px' };

  private resizeObserver!: ResizeObserver;

  constructor(
    private wpx: WpxService,
    private datasets: DatasetsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height, width } = entry.contentRect;
        this.scroll = { x: width - 65 + 'px', y: height - 180 + 'px' };
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver.observe(this.card.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
  }

  getData(): void {
    this.datasets.lists(this.items.searchText).subscribe(data => {
      this.items.data = [...data];
    });
  }

  clearSearch(): void {
    this.items.searchText = '';
    this.getData();
  }

  openForm(): void {
    this.modal.create<FormComponent>({
      nzTitle: '创建',
      nzContent: FormComponent,
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  openControls(name: string): void {
    this.drawer.create({
      nzContent: ControlsComponent,
      nzContentParams: {
        name,
        updated: () => {
          this.getData();
        }
      },
      nzClosable: false,
      nzWidth: 800
    });
  }

  update(name: string, status: string): void {
    this.wpx
      .getValues(['RestControls'])
      .pipe(
        switchMap(data => {
          const controls = data['RestControls'];
          controls[name][status] = !controls[name][status];
          return this.wpx.setValues({
            RestControls: controls
          });
        })
      )
      .subscribe(() => {
        this.message.success(`数据更新成功`);
        this.getData();
      });
  }

  delete(data: Dataset): void {
    this.modal.confirm({
      nzTitle: `您确定要删除【${data.name}】吗？`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.datasets.delete(data.name).subscribe(() => {
          this.message.success(`数据更新成功`);
          this.getData();
        });
      }
    });
  }
}
