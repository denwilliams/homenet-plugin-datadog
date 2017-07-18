import {IPluginLoader, ILogger, IConfig, IEventBus, IStatsTarget} from '@homenet/core';
import * as metrics from 'datadog-metrics';

interface IDatadogConfig extends IConfig {
  datadog: {
    apiKey: string;
    appKey: string;
  }
}

export function create(annotate: any): { DatadogPluginLoader: new(...args: any[]) => IPluginLoader } {
  @annotate.plugin()
  class DatadogPluginLoader implements IStatsTarget {
    private metricsLogger: any;

    constructor(
      @annotate.service('IConfig') private config: IDatadogConfig,
      @annotate.service('ILogger') private logger: ILogger,
      @annotate.service('IEventBus') private eventBus: IEventBus
    ) {
      this.metricsLogger = new metrics.BufferedMetricsLogger({
        apiKey: config.datadog.apiKey,
        appKey: config.datadog.appKey,
        // host: 'myhost',
        prefix: 'homenet.',
        flushIntervalSeconds: 30,
        // defaultTags: ['env:staging', 'region:us-east-1']
      });
    }

    load() : void {
      this.logger.info('Loading DataDog');

      this.eventBus.on('value.*', '*', e => {
        this.gauge(e.id, e.value);
      });
      this.eventBus.on('trigger.*', 'triggered', e => {
        this.counter(e.id);
      });
    }

    gauge(id: string, value: number) : void {
      this.metricsLogger.gauge(id, value);
    }

    counter(id: string, increment?: number) : void {
      this.metricsLogger.increment(id, increment);
    }
  }

  return { DatadogPluginLoader };
}
