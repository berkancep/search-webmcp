import { createServer } from 'vite';
import { api } from './index.mjs';
const server = await createServer({
  server: { host: '127.0.0.1', port: 5173 },
  plugins: [
    {
      name: 'mock-search',
      configureServer(s) {
        s.middlewares.use((req, res, next) => {
          if (!api(req, res)) next();
        });
      },
    },
  ],
});
await server.listen();
server.printUrls();
