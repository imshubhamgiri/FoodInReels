import type { Logger } from 'winston';
import devLogger from './devLogger';
import uatLogger from './uatLogger';
import productionLogger from './productionLogger';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

const env = process.env.NODE_ENV;

let logger: Logger;

switch (env) {
    case 'production':
        logger = productionLogger;
        break;
    case 'uat':
        logger = uatLogger;
        break;
    case 'dev':
    case 'development':
    default:
        logger = devLogger;
        break;
}

logger.add(new OpenTelemetryTransportV3());

export default logger;
