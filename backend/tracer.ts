// tracer.ts
import dotenv from 'dotenv';
dotenv.config();

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { PeriodicExportingMetricReader, AggregationTemporality } from '@opentelemetry/sdk-metrics'; 
import { SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';

import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME, ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from '@opentelemetry/semantic-conventions';

const hasDatadogKey = Boolean(process.env.DD_API_KEY);
const useDatadogTelemetry = hasDatadogKey && process.env.NODE_ENV === 'production';
console.log(`[Tracer Debug] DD_API_KEY detected: ${hasDatadogKey}`);
console.log(`[Tracer Debug] Environment: ${process.env.NODE_ENV || 'production'}`);

const customResource = defaultResource().merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'foodinreels-api',
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: process.env.NODE_ENV || 'production',
  })
);

const sdk = new NodeSDK({
  resource: customResource,

  traceExporter: useDatadogTelemetry
    ? new OTLPTraceExporter({
        url: 'https://otlp.us5.datadoghq.com/v1/traces',
        headers: { 'dd-api-key': process.env.DD_API_KEY as string },
      })
    : new ConsoleSpanExporter(),

  // Only export metrics to Datadog in production; local dev uses console logs only.
  metricReader: useDatadogTelemetry
    ? new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: 'https://otlp.us5.datadoghq.com/v1/metrics',
          headers: { 'dd-api-key': process.env.DD_API_KEY as string },
          temporalityPreference: AggregationTemporality.DELTA,
        }),
      })
    : undefined,

  logRecordProcessor: useDatadogTelemetry
    ? new SimpleLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: 'https://otlp.us5.datadoghq.com/v1/logs',
          headers: { 'dd-api-key': process.env.DD_API_KEY as string },
        })
      })
    : undefined,

  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

try {
  sdk.start();
  console.log('[Tracer Debug] OpenTelemetry SDK engine running smoothly.');
} catch (error) {
  console.error('OpenTelemetry tracer failed to start:', error);
}

export default sdk;