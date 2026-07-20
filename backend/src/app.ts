import express  from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import corsMiddleware from './middleware/cors';
import logger from './middleware/logging';
import appLogger from './logger';
import { attachAuthContext } from './middleware/auth';
import { globalApiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { helmetMiddleware } from './middleware/helmet';
import { getDbHealth } from './db/db';
import rootRouter from './routes';
import openApiDocument from './docs/openapi';

const app = express();
app.set('trust proxy', 1); 
const testMode = process.env.NODE_ENV === 'test';
// Early log (before auth)
!testMode && app.use((req, _res, next) => {
  appLogger.info('HTTP request received', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  next();
});

app.use(helmetMiddleware);
app.use(globalApiLimiter);

app.use(cookieParser());
app.use(express.json());

// GLOBAL MIDDLEWARES (run before all routes)
app.use(corsMiddleware);
app.use(attachAuthContext);
!testMode && app.use(logger);


app.use('/api', rootRouter)

app.get('/api-docs.json', (_req, res) => {
  res.json(openApiDocument);
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    explorer: true,
    customSiteTitle: 'FoodInReels API Docs',
    swaggerOptions: {
      displayRequestDuration: true,
    },
  })
);

// app.use('/api/foods', foodRoutes);

// app.use('/api/users', userprofileRoutes);
// app.use('/api/partners', profileRoutes);
// app.use('/api/actions',actionRoutes)
// app.use('/api/v1/orders', orderRoutes);

app.get('/', (_req, res) => {
  res.send('Backend is running');
});

// Health check endpoint
app.get('/health', (_req, res) => {
  const db = getDbHealth();
  const status = db.isConnected ? 'healthy' : 'degraded';

  res.status(db.isConnected ? 200 : 503).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'FoodInReels API',
    db,
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;