import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupChat } from './chat';

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

const app = express();

app.get('/', (_req: Request, res: Response) => {
    res.sendFile(`${__parent}/index.html`);
});

const server = http.createServer(app);

setupChat(server);

const port = 3000;
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
