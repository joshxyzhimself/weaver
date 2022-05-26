// @ts-check

import url from 'url';
import path from 'path';
import * as luxon from 'luxon';
import { config } from './modules/config.mjs';
import * as uwu from './modules/uwu.mjs';
import * as telegram from './modules/telegram.mjs';
import { assert } from './modules/assert.mjs';


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

    await telegram.stream_updates(config.telegram_token, async (update) => {
      if (typeof update?.message?.text === 'string') {
        const segments = update.message.text.split(' ');
        switch (segments[0]) {
          case '/daily': {
            try {
              const name = segments[1];
              assert(typeof name === 'string', 'ERR_INVALID_TASK_NAME', 'Invalid task name.');

              const time_string = segments[2];
              assert(typeof time_string === 'string', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
              assert(time_string.length === 4, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

              const time_number = Number(segments[2]);
              assert(typeof time_number === 'number', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
              assert(Number.isFinite(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
              assert(Number.isInteger(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

              const hour = Number(time_string.substring(0, 2));
              const minute = Number(time_string.substring(2, 4));
              const now = luxon.DateTime.utc();
              const current = luxon.DateTime.utc().set({ hour, minute });
              const next = now < current ? current : current.plus({ day: 1 });
              const text = [
                '-- created:',
                `name: ${name}`,
                `now: ${now.toHTTP()}`,
                `current: ${current.toHTTP()}`,
                `next: ${next.toHTTP()}`,
              ].join('\n');
              await telegram.send_message(config.telegram_token, {
                chat_id: -691850503,
                text: telegram.text(text),
                parse_mode: 'MarkdownV2',
              });
            } catch (e) {
              await telegram.send_message(config.telegram_token, {
                chat_id: -691850503,
                text: telegram.text(e.message),
                parse_mode: 'MarkdownV2',
              });
            }
            break;
          }
          case '/weekly': {
            break;
          }
          case '/test': {
            await telegram.send_message(config.telegram_token, {
              chat_id: -691850503,
              text: telegram.text('/test OK.'),
              parse_mode: 'MarkdownV2',
            });
            break;
          }
          default: {
            break;
          }
        }
      }
    });

  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});