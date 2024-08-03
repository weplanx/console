import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ShareModule } from '@common/share.module';
import { WpxService } from '@weplanx/ng';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { FormComponent } from './form/form.component';
import { KeyValue } from './types';

@Component({
  standalone: true,
  imports: [ShareModule, FormComponent],
  selector: 'app-admin-settings-values',
  templateUrl: './values.component.html',
  styleUrl: './values.component.css'
})
export class ValuesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(NzCardComponent, { read: ElementRef, static: true }) card!: ElementRef;

  searchText = '';
  items: KeyValue[] = [];
  loading = false;

  y = '0px';
  private resizeObserver!: ResizeObserver;

  constructor(
    private wpx: WpxService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        this.y = height - 180 + 'px';
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
    this.loading = true;
    this.wpx.getValues().subscribe(data => {
      this.items = [
        ...Object.entries(data)
          .map(([key, value]) => {
            switch (key) {
              case 'IpBlacklist':
              case 'IpWhitelist':
              case 'RestControls':
                value = JSON.stringify(value);
                break;
            }
            return <KeyValue>{ key, value };
          })
          .filter(v => {
            if (!this.searchText) {
              return v;
            }
            return v.key.match(this.searchText);
          })
      ];
      this.loading = false;
    });
  }

  clearSearch(): void {
    this.searchText = '';
    this.getData();
  }

  form(data?: KeyValue): void {
    this.modal.create<FormComponent, KeyValue>({
      nzTitle: `Dynamic Values Modify`,
      nzWidth: '732px',
      nzContent: FormComponent,
      nzData: data,
      nzOnOk: () => {
        this.getData();
      }
    });
  }

  delete(key: string): void {
    this.modal.confirm({
      nzTitle: `Do you want to delete this?`,
      nzContent: key,
      nzOkText: `Yes`,
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.wpx.deleteValue(key).subscribe(() => {
          this.message.success(`Deletion successful`);
          this.getData();
        });
      },
      nzCancelText: `Think again`
    });
  }
}
