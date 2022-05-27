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

/**
 * @type {Map<number, number>}
 */
const utc_offsets = new Map();

const tasks = [];

/**
 * @param {number} offset
 */
const utc_offset_to_timezone = (offset) => {
  if (offset >= 0) {
    return 'UTC+'.concat(String(offset));
  }
  return 'UTC'.concat(String(offset));
};

process.nextTick(async () => {

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
        case '/tz': {
          const chat_id = update.message.chat.id;
          if (segments.length === 1) {
            const utc_offset = utc_offsets.get(chat_id) || 0;
            await telegram.send_message(config.telegram_token, {
              chat_id: -691850503,
              text: telegram.text(`Timezone offset is ${utc_offset_to_timezone(utc_offset)}.`),
              parse_mode: 'MarkdownV2',
            });
            break;
          }
          try {

            const offset_string = segments[1];
            assert(typeof offset_string === 'string', 'ERR_INVALID_utc_offset', 'Invalid timezone offset.');

            const offset_string_prefix = offset_string.substring(0, 1);
            assert(offset_string_prefix === '+' || offset_string_prefix === '-', 'ERR_INVALID_utc_offset', 'Invalid timezone offset.');

            const offset_number = Number(offset_string);
            assert(typeof offset_number === 'number', 'ERR_INVALID_utc_offset', 'Invalid timezone offset.');
            assert(Number.isFinite(offset_number) === true, 'ERR_INVALID_utc_offset', 'Invalid timezone offset.');
            assert(Number.isInteger(offset_number) === true, 'ERR_INVALID_utc_offset', 'Invalid timezone offset.');

            const utc_offset = offset_number;
            utc_offsets.set(chat_id, offset_number);

            await telegram.send_message(config.telegram_token, {
              chat_id: -691850503,
              text: telegram.text(`Timezone offset set to ${utc_offset_to_timezone(utc_offset)}.`),
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
        case '/daily': {
          try {

            const chat_id = update.message.chat.id;
            const utc_offset = utc_offsets.get(chat_id) || 0;

            const name = segments[1];
            assert(typeof name === 'string', 'ERR_INVALID_TASK_NAME', 'Invalid task name.');

            const time_string = segments[2];
            assert(typeof time_string === 'string', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
            assert(time_string.length === 4, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

            const time_number = Number(time_string);
            assert(typeof time_number === 'number', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
            assert(Number.isFinite(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
            assert(Number.isInteger(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

            const hour = Number(time_string.substring(0, 2));
            const minute = Number(time_string.substring(2, 4));

            const now = luxon.DateTime.now().setZone(utc_offset_to_timezone(utc_offset));
            const current = now.set({ hour, minute, second: 0, millisecond: 0 });
            const next = now < current ? current : current.plus({ day: 1 });

            const task = { chat_id, name, next: next.toISO() };
            tasks.push(task);

            const text = [
              '-- created:',
              `name: ${name}`,
              `now: ${now.toISO()}`,
              `current: ${current.toISO()}`,
              `next: ${next.toISO()}`,
              JSON.stringify({ task }, null, 2),
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

});