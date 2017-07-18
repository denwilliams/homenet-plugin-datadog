"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var metrics = require("datadog-metrics");
function create(annotate) {
    var DatadogPluginLoader = (function () {
        function DatadogPluginLoader(config, logger, eventBus) {
            this.config = config;
            this.logger = logger;
            this.eventBus = eventBus;
            this.metricsLogger = new metrics.BufferedMetricsLogger({
                apiKey: config.datadog.apiKey,
                appKey: config.datadog.appKey,
                // host: 'myhost',
                prefix: 'homenet.',
                flushIntervalSeconds: 30,
            });
        }
        DatadogPluginLoader.prototype.load = function () {
            var _this = this;
            this.logger.info('Loading DataDog');
            this.eventBus.on('value.*', '*', function (e) {
                _this.gauge(e.id, e.value);
            });
            this.eventBus.on('trigger.*', 'triggered', function (e) {
                _this.counter(e.id);
            });
        };
        DatadogPluginLoader.prototype.gauge = function (id, value) {
            this.metricsLogger.gauge(id, value);
        };
        DatadogPluginLoader.prototype.counter = function (id, increment) {
            this.metricsLogger.increment(id, increment);
        };
        return DatadogPluginLoader;
    }());
    DatadogPluginLoader = __decorate([
        annotate.plugin(),
        __param(0, annotate.service('IConfig')),
        __param(1, annotate.service('ILogger')),
        __param(2, annotate.service('IEventBus'))
    ], DatadogPluginLoader);
    return { DatadogPluginLoader: DatadogPluginLoader };
}
exports.create = create;
