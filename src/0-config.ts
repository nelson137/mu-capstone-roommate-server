import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
