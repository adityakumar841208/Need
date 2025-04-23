// server.ts
import { createServer, Server as HttpServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { initSocketServer } from './src/lib/socketServer';

const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server: HttpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url || '', true);
        handle(req, res, parsedUrl);
    });

    // Initialize socket server
    initSocketServer(server);

    server.listen(3000, (err?: Error) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
}).catch((err: Error) => {
    console.error('Error starting server:', err);
    process.exit(1);
});