import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import partnerRoutes from './routes/partner.routes';
import orderRoutes from './routes/order.routes';
import auditRoutes from './routes/auditLog.routes';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import routes from './routes';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

const app: Express = express();

// Trust reverse proxies (Render, Vercel, Cloudflare, etc.)
app.set('trust proxy', 1);

// Disable ETags to prevent 304 response caching issues on API endpoints
app.set('etag', false);

// Security & Cache Control Middleware
app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

// Request Logger Middleware (for Render / stdout logs)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes'
    }
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', apiLimiter);

// CORS Configuration - allow any origin with credentials
app.use(cors({
  origin: true,
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/audit-logs', auditRoutes);

// API Routes
app.use('/api/v1', routes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
