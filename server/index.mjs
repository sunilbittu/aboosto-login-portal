import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const PORT = Number(process.env.PORT ?? 8085);
const STATIC_DIR = process.env.STATIC_DIR ?? '../dist';

const CONFIG_PROXY_PREFIX = process.env.CONFIG_PROXY_PREFIX ?? '/config-api';
const CONFIG_PROXY_TARGET = process.env.CONFIG_PROXY_TARGET ?? 'http://123.176.35.22:8081';
const ADMIN_PROXY_PREFIX = process.env.ADMIN_PROXY_PREFIX ?? '/admin-api';
const ADMIN_PROXY_TARGET = process.env.ADMIN_PROXY_TARGET ?? 'http://123.176.35.22:8082';

const rawCorsOrigins = process.env.CORS_ALLOW_ORIGIN;
const allowedOrigins = rawCorsOrigins
  ?.split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

const corsOptions = {
  origin: allowedOrigins?.length ? allowedOrigins : true,
  credentials: true,
};

const app = express();

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(
  CONFIG_PROXY_PREFIX,
  createProxyMiddleware({
    target: CONFIG_PROXY_TARGET,
    changeOrigin: true,
    pathRewrite: {
      [`^${CONFIG_PROXY_PREFIX}`]: '',
    },
  })
);

app.use(
  ADMIN_PROXY_PREFIX,
  createProxyMiddleware({
    target: ADMIN_PROXY_TARGET,
    changeOrigin: true,
    pathRewrite: {
      [`^${ADMIN_PROXY_PREFIX}`]: '',
    },
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolvedStaticDir = path.resolve(__dirname, STATIC_DIR);

app.use(express.static(resolvedStaticDir));

app.get('*', (req, res) => {
  res.sendFile(path.join(resolvedStaticDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Aboosto Login Portal listening on http://localhost:${PORT}`);
  console.log(`Config API proxy -> ${CONFIG_PROXY_PREFIX} → ${CONFIG_PROXY_TARGET}`);
  console.log(`Admin API proxy  -> ${ADMIN_PROXY_PREFIX} → ${ADMIN_PROXY_TARGET}`);
});
