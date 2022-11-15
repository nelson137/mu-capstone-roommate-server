import cors from 'cors';
import express from 'express';
import http from 'http';
import './0-config';
import { setupChat } from './chat';
import { setupDatabase } from './db';
import { appRouter } from './routes';

await setupDatabase();

const app = express();

app.use(cors());

app.use(express.json({ type: '*/*' }));

app.use('/', appRouter);

const server = http.createServer(app);

setupChat(server);

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
