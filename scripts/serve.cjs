const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../website');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp4': 'video/mp4' };
const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  let file;
  try { file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400).end('Invalid URL'); return; }
  if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end('Forbidden'); return; }
  if (file === root || file.endsWith(path.sep)) file = path.join(file, 'index.html');
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  });
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Stop the other preview or set PORT to another number.` : error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Elluzion AI preview: http://127.0.0.1:${port}\nPress Ctrl+C to stop.`));
