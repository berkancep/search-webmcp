import { createServer } from 'node:http';
import { search } from './search.mjs';
export function api(req, res) {
  if (!req.url?.startsWith('/api/search')) return false;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  try {
    const u = new URL(req.url, 'http://localhost');
    const state = JSON.parse(u.searchParams.get('state') || '{}');
    res.end(JSON.stringify(search(state)));
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: e.message }));
  }
  return true;
}
if (process.argv[1]?.endsWith('/index.mjs'))
  createServer((req, res) => {
    if (!api(req, res)) {
      res.statusCode = 404;
      res.end();
    }
  }).listen(3001, '127.0.0.1', () => console.log('API http://localhost:3001'));
