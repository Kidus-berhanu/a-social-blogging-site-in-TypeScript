// Import the necessary packages
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { createClient } from 'redis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { join } from 'path';

// Set up the Express app
const app = express();

// Enable compression to minimize the size of response data
app.use(compression());

// Set up the Helmet middleware for improved security
app.use(helmet());

// Enable request logging for debugging and performance analysis
app.use(morgan('combined'));

// Serve static files from a cache
const redisClient = createClient({
  host: 'localhost',
  port: 6379,
  db: 0
});
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate-limiter',
  points: 10,
  duration: 1
});
app.use(express.static(join(__dirname, 'public'), {
  maxAge: '1d',
  etag: false,
  lastModified: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    limiter.consume(res.socket.remoteAddress)
      .then(() => console.log('Request limit under the rate threshold'))
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  }
}));
