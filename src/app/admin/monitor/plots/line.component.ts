import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  signal,
  ViewChild
} from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Line, LineOptions } from '@antv/g2plot';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';

import { MonitorService } from '../monitor.service';
import { ExporterName } from '../types';

@Component({
  standalone: true,
  imports: [ShareModule],
  selector: 'app-monitor-line',
  template: `
    <nz-card
      [nzBodyStyle]="{ 'min-height': height }"
      nzSize="small"
      nzType="inner"
      [nzTitle]="title"
      [nzLoading]="loading()"
    >
      <div #ref></div>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent implements AfterContentInit, OnDestroy {
  @ViewChild('ref', { static: true }) ref!: ElementRef;

  @Input({ required: true }) title!: string;
  @Input({ required: true }) name!: ExporterName;
  @Input() height = '180px';
  @Input() options?: Omit<LineOptions, 'data'>;
  @Input() fn?: (plot: Line, data: Any[][]) => void;

  loading = signal(true);
  private plot!: Line;
  private subscription!: Subscription;

  constructor(private observability: MonitorService) {}

  ngAfterContentInit(): void {
    this.plot = new Line(this.ref.nativeElement, {
      data: [],
      height: 180,
      xField: 'time',
      yField: 'value',
      ...this.options
    });
    this.plot.render();
    this.subscription = this.observability.interval$
      .pipe(
        switchMap(v => timer(0, v * 1000)),
        switchMap(() => this.observability.exporter<Any[][]>(this.name))
      )
      .subscribe(data => {
        if (!this.fn) {
          this.plot.changeData(data.map(v => ({ time: v[0], value: v[1] })));
        } else {
          this.fn(this.plot, data);
        }
        setTimeout(() => {
          this.loading.set(false);
        }, 200);
      });
  }

  ngOnDestroy(): void {
    this.plot.destroy();
    this.subscription.unsubscribe();
  }
}
