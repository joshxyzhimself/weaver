// @ts-check

import fs from 'fs';
import url from 'url';
import path from 'path';
import { config } from './config.mjs';
import * as telegram from './telegram.mjs';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.nextTick(async () => {
  const image_buffer = fs.readFileSync(path.join(__dirname, 'dog.png'));
  await telegram.send_photo(config.telegram_token, {
    chat_id: -691850503,
    photo: image_buffer,
    caption: 'dogdog',
  });
});