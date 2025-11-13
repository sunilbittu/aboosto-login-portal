import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.PORT ?? 4173);
const STATIC_DIR = process.env.STATIC_DIR ?? '../dist';

const app = express();

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
