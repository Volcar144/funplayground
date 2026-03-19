import * as Sentry from '@sentry/nextjs';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { logs } from '@opentelemetry/api-logs'
import { resourceFromAttributes } from '@opentelemetry/resources'
import {} from "dotenv/config"

export const loggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ 'service.name': 'my-nextjs-app' }),
  processors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: 'https://eu.i.posthog.com/i/v1/logs',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`,
          'Content-Type': 'application/json',
        },
      })
    ),
  ],
})

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    
    await import('./instrumentation.node');
    logs.setGlobalLoggerProvider(loggerProvider);
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;