import { preview } from 'vite';
import { api } from './index.mjs';
const server = await preview({
  preview: { host: '127.0.0.1', port: 5173 },
  plugins: [
    {
      name: 'mock-search-preview',
      configurePreviewServer(s) {
        s.middlewares.use((req, res, next) => {
          if (!api(req, res)) next();
        });
      },
    },
  ],
});
server.printUrls();
