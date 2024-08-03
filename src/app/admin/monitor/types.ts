import { Meta } from '@antv/g2plot';

export type ExporterName =
  | 'mongo_available_connections'
  | 'mongo_open_connections'
  | 'mongo_commands_per_second'
  | 'mongo_query_operations'
  | 'mongo_document_operations'
  | 'mongo_flushes'
  | 'mongo_network_io'
  | 'redis_mem'
  | 'redis_cpu'
  | 'redis_ops_per_sec'
  | 'redis_evi_exp_keys'
  | 'redis_collections_rate'
  | 'redis_connected_slaves'
  | 'redis_hit_rate'
  | 'redis_network_io'
  | 'nats_cpu'
  | 'nats_mem'
  | 'nats_connections'
  | 'nats_subscriptions'
  | 'nats_slow_consumers'
  | 'nats_msg_io'
  | 'nats_bytes_io';

export const MetaType: Record<string, Record<string, Meta>> = {
  default: {
    value: {
      alias: 'Value'
    }
  },
  k: {
    value: {
      alias: 'Value',
      formatter: v => {
        if (v > 1000000) {
          return (v / 1000000).toFixed(2) + ' M';
        }
        if (v > 10000) {
          return (v / 10000).toFixed(2) + ' W';
        }
        return Math.trunc(v);
      }
    }
  },
  ms: {
    value: {
      alias: 'Ms',
      formatter: v => v + 'ms'
    }
  },
  fixed: {
    value: {
      alias: 'Value',
      formatter: v => {
        return v.toFixed(2);
      }
    }
  },
  ops: {
    value: {
      alias: 'Value',
      formatter: value => `${value} Ops`
    }
  },
  bytes: {
    value: {
      alias: 'Value',
      formatter: v => {
        if (v > 1048576) {
          return (v / 1048576).toFixed(2) + ` Mb`;
        }
        if (v > 1024) {
          return (v / 1024).toFixed(2) + ` Kb`;
        }
        return `${v} b`;
      }
    }
  }
};
