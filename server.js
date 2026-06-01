const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const PRODUCTS_CSV = path.join(ROOT_DIR, 'products.csv');

function escapeCsvValue(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function rowsToCsv(rows) {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  if (!normalizedRows.length) {
    return '';
  }

  const keys = Object.keys(normalizedRows[0]);
  const headerLine = keys.map(escapeCsvValue).join(',');
  const bodyLines = normalizedRows.map(row => keys.map(key => escapeCsvValue(row[key])).join(','));
  return [headerLine, ...bodyLines].join('\n');
}

function writeProductsCsv(rows) {
  const csvText = rowsToCsv(rows);
  fs.writeFileSync(PRODUCTS_CSV, csvText, 'utf8');
  return csvText;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.csv': return 'text/csv; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

function serveStaticFile(req, res, requestedPath) {
  const safePath = path.normalize(requestedPath).replace(/^\.+/, '');
  const fullPath = path.join(ROOT_DIR, safePath);

  if (!fullPath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.readFile(fullPath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': getContentType(fullPath),
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/sync-products') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const rows = Array.isArray(payload.rows) ? payload.rows : [];

        if (!rows.length) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: 'No rows were provided.' }));
          return;
        }

        const csvText = writeProductsCsv(rows);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, rows: rows.length, csvPath: 'products.csv', csvLength: csvText.length }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: error.message }));
      }
    });
    return;
  }

  const requestPath = req.url === '/' ? '/admin.html' : req.url.split('?')[0];
  serveStaticFile(req, res, requestPath);
});

server.listen(PORT, () => {
  console.log(`Sync server listening at http://localhost:${PORT}`);
});
