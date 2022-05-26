// @ts-check

import url from 'url';
import path from 'path';
import { config } from './modules/config.mjs';
import * as uwu from './modules/uwu.mjs';
import * as telegram from './modules/telegram.mjs';


const __production = process.argv.includes('--production');
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log({ config, __production, __filename, __dirname });

process.nextTick(async () => {
  try {

    const app = uwu.uws.App({});

    app.get('/*', uwu.create_handler(async (response, request) => {
      response.json = { request };
    }));

    await uwu.serve_http(app, uwu.port_access_types.EXCLUSIVE, config.http_port);

    console.log(`Listening to port ${config.http_port}.`);

    await telegram.send_message(config.telegram_token, {
      chat_id: -691850503,
      text: 'Example message.',
      parse_mode: 'MarkdownV2',
    });

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});