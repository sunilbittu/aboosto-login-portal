import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = Number(process.env.PORT ?? 4173);
const STATIC_DIR = process.env.STATIC_DIR ?? '../dist';
const PROXY_PREFIX = process.env.PROXY_PREFIX ?? '/api';
const PROXY_TARGET = process.env.PROXY_TARGET ?? 'http://123.176.35.22:8082';
const PROXY_TARGET_PATH = process.env.PROXY_TARGET_PATH ?? '/api';
const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN ?? '';

const app = express();

app.use((req, res, next) => {
  if (CORS_ALLOW_ORIGIN) {
    res.header('Access-Control-Allow-Origin', CORS_ALLOW_ORIGIN);
  }
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers') ?? 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(PROXY_PREFIX, express.json({ limit: '10mb', strict: false }));
app.use(PROXY_PREFIX, express.urlencoded({ extended: true }));

app.use(
  PROXY_PREFIX,
  createProxyMiddleware({
    target: PROXY_TARGET,
    changeOrigin: true,
    selfHandleResponse: false,
    pathRewrite: (path) => {
      const suffix = path.slice(PROXY_PREFIX.length);
      return PROXY_TARGET_PATH + suffix;
    },
    onProxyReq: (proxyReq, req) => {
      if (!req.body || Object.keys(req.body).length === 0) {
        return;
      }

      const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.setHeader('Content-Type', proxyReq.getHeader('Content-Type') ?? 'application/json');
      proxyReq.write(bodyData);
    },
    logLevel: process.env.PROXY_LOG_LEVEL ?? 'warn',
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolvedStaticDir = path.resolve(__dirname, STATIC_DIR);

app.use(express.static(resolvedStaticDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(resolvedStaticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://localhost:${PORT}`);
});
