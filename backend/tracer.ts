// tracer.ts
import dotenv from 'dotenv';
dotenv.config();

// Disable the auto-created metrics pipeline — we're only sending traces.
// Must be set before NodeSDK is instantiated.
process.env.OTEL_METRICS_EXPORTER = 'none';

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// Force OpenTelemetry internal logging to error to eliminate metric timeout spam
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
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
        url: 'https://otlp.us5.datadoghq.com/v1/traces', // <-- fixed: path added
        headers: {
          'dd-api-key': process.env.DD_API_KEY as string,
        },
      })
    : new ConsoleSpanExporter(),

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