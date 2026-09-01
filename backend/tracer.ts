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

  traceExporter: hasDatadogKey
    ? new OTLPTraceExporter({
        url: 'https://otlp.us5.datadoghq.com/v1/traces',
        headers: { 'dd-api-key': process.env.DD_API_KEY as string },
      })
    : new ConsoleSpanExporter(),

  // --- Added DELTA temporality preference for Datadog ---
  metricReader: hasDatadogKey
    ? new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: 'https://otlp.us5.datadoghq.com/v1/metrics',
          headers: { 'dd-api-key': process.env.DD_API_KEY as string },
          temporalityPreference: AggregationTemporality.DELTA,
        }),
      })
    : undefined,

  // --- Fixed syntax using the correct configuration options object ---
  logRecordProcessor: hasDatadogKey
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