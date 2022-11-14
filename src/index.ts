import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupChat } from './chat';
import { setupDatabase } from './db';
import { appRouter } from './routes';

// Get path of current file, directory, and the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __parent = path.dirname(__dirname);

dotenv.config({ path: path.resolve(__parent, 'environment/.env') });
for (const requiredVar of ['DATABASE_URL', 'JWT_SECRET']) {
    if (!process.env[requiredVar]) {
        console.error(
            `\nError: required environment variable ${requiredVar} not found, please provide a value for this variable in the .env file.\n`,
        );
        process.exit(1);
    }
}

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
