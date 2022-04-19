import { App } from '@godgiven/type-server';
import { authFunction } from './middleware/authentication-user.js';
import {
  pageHome,
  pagePublicProfile,
} from './page/index.js';
import { config } from 'dotenv';

config();

// envierment
const port = parseInt(process.env.port as string);
const vertion = process.env.ver ?? 'v1';

const app = new App();

app.port = !isNaN(port) ? port : 5000;
app.version = vertion;
app.middlewareList.push(authFunction);

app.register('GET', '/', pageHome);
app.register('GET', '', pageHome);
app.register('POST', '/public', pagePublicProfile);

app.listen();
