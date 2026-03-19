import { AnyValueMap, AnyValue, SeverityNumber } from '@opentelemetry/api-logs'
import { after } from 'next/server'
import { loggerProvider } from '@/instrumentation'
import * as sentry from "@sentry/nextjs"

const logger = loggerProvider.getLogger('my-nextjs-app')

type LogAttributes = AnyValueMap;
type LogBody = AnyValue;
enum severity {
    DEBUG,
    INFO,
    ERROR,
    FATAL,
    WARN
}

type emitArg = {
    body: LogBody,
    severity: severity,
    attributes: AnyValueMap
}

export default function log(record: emitArg){
    logger.emit({
        body: record.body,
        severityNumber: 
    })
    
}