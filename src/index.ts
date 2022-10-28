import express from 'express';
import http from 'http';
import { setupChat } from './chat';
import { setupDatabase } from './db';
import { appRouter } from './routes';

// Get path of current file, directory, and the parent directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const __parent = path.dirname(__dirname);

await setupDatabase();

const app = express();

app.use('/', appRouter);

const server = http.createServer(app);

setupChat(server);

const port = 3000;
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
