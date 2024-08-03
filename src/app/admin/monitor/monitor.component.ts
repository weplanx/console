import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Area, AreaOptions, LineOptions } from '@antv/g2plot';
import { ShareModule } from '@common/share.module';
import { Any } from '@weplanx/ng';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';

import { MonitorService } from './monitor.service';
import { AreaComponent } from './plots/area.component';
import { LineComponent } from './plots/line.component';
import { SumComponent } from './plots/sum.component';
import { ExporterName, MetaType } from './types';

@Component({
  standalone: true,
  imports: [ShareModule, NzSegmentedModule, AreaComponent, LineComponent, SumComponent],
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitorService]
})
export class MonitorComponent implements OnInit {
  dashboards = ['MONGO', 'REDIS', 'NATS'];
  index = 0;
  options: Partial<Record<ExporterName, Omit<AreaOptions & LineOptions, 'data'>>> = {
    mongo_available_connections: {
      meta: MetaType['k']
    },
    mongo_open_connections: {
      meta: MetaType['k']
    },
    mongo_commands_per_second: {
      meta: MetaType['ops']
    },
    mongo_query_operations: {
      seriesField: 'operate',
      meta: MetaType['ops']
    },
    mongo_document_operations: {
      seriesField: 'operate',
      meta: MetaType['ops']
    },
    mongo_flushes: {
      meta: MetaType['k']
    },
    mongo_network_io: {
      seriesField: 'type',
      meta: MetaType['bytes']
    },
    redis_ops_per_sec: {
      meta: MetaType['k']
    },
    redis_collections_rate: {
      meta: MetaType['default']
    },
    redis_hit_rate: {
      meta: MetaType['default']
    },
    redis_cpu: {
      seriesField: 'type',
      meta: MetaType['fixed']
    },
    redis_evi_exp_keys: {
      seriesField: 'type',
      meta: MetaType['default']
    },
    redis_mem: {
      seriesField: 'type',
      meta: MetaType['bytes']
    },
    redis_network_io: {
      seriesField: 'type',
      meta: MetaType['bytes']
    },
    nats_connections: {
      meta: MetaType['k']
    },
    nats_subscriptions: {
      meta: MetaType['k']
    },
    nats_slow_consumers: {
      meta: MetaType['k']
    },
    nats_cpu: {
      meta: {
        value: {
          alias: 'Value',
          formatter: v => v / 100
        }
      }
    },
    nats_mem: {
      meta: MetaType['bytes']
    },
    nats_msg_io: {
      seriesField: 'type',
      meta: MetaType['default']
    },
    nats_bytes_io: {
      seriesField: 'type',
      meta: MetaType['bytes']
    }
  };
  mongo_query_operations = (plot: Area, data: Any[][]): void => {
    const text = [`Command`, `Read`, `Insert`, `Update`, `Delete`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], operate: text[v[2]] })));
  };
  mongo_document_operations = (plot: Area, data: Any[][]): void => {
    const text = [`Read`, `Insert`, `Update`, `Delete`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], operate: text[v[2]] })));
  };
  mongo_network_io = (plot: Area, data: Any[][]): void => {
    const text = [`Input`, `Output`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  redis_cpu = (plot: Area, data: Any[][]): void => {
    const text = [`used_cpu_user`, `used_cpu_sys`, `used_cpu_sys_children`, `used_cpu_user_children`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  redis_evi_exp_keys = (plot: Area, data: Any[][]): void => {
    const text = [`evicted_keys`, `expired_keys`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  redis_mem = (plot: Area, data: Any[][]): void => {
    const text = [`used_memory`, `used_memory_dataset`, `used_memory_rss`, `used_memory_lua`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  redis_network_io = (plot: Area, data: Any[][]): void => {
    const text = [`Input`, `Output`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  nats_msg_io = (plot: Area, data: Any[][]): void => {
    const text = [`Input`, `Output`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };
  nats_bytes_io = (plot: Area, data: Any[][]): void => {
    const text = [`Input`, `Output`];
    plot.changeData(data.map(v => ({ time: v[0], value: v[1], type: text[v[2]] })));
  };

  constructor(
    public observability: MonitorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.index = this.dashboards.indexOf((data['type'] as string).toUpperCase());
    });
  }

  open(index: number): void {
    this.router.navigate(['/admin', 'monitor', this.dashboards[index].toLowerCase()]);
  }
}
