// @ts-check

import url from 'url';
import path from 'path';
import * as luxon from 'luxon';
import { config } from '@jxyz/modules/config.mjs';
import * as uwu from '@jxyz/modules/uwu.mjs';
import * as telegram from '@jxyz/modules/telegram.mjs';
import * as proc from '@jxyz/modules/proc.mjs';
import { assert } from '@jxyz/modules/assert.mjs';


assert(typeof config.http_hostname === 'string');
assert(typeof config.http_port === 'number');
assert(typeof config.telegram_token === 'string');

const __production = process.argv.includes('--production');
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __offsets = path.join(__dirname, 'offsets.json');
const __tasks = path.join(__dirname, 'tasks.json');

console.log({ config, __production, __filename, __dirname });

/**
 * @type {Map<number, number>}
 */
const offsets = new Map(proc.load_array(__offsets));

/**
 * @type {import('./index').task[]}
 */
const tasks = proc.load_array(__tasks);

proc.on_exit(() => {
  proc.save_array(__offsets, Array.from(offsets));
  proc.save_array(__tasks, tasks);
  console.log('END.');
});

/**
 * @param {number} offset
 */
const utc_offset_to_timezone = (offset) => {
  if (offset >= 0) {
    return 'UTC+'.concat(String(offset));
  }
  return 'UTC'.concat(String(offset));
};

const handle_tasks = async () => {
  for (let i = 0, l = tasks.length; i < l; i += 1) {
    const task = tasks[i];
    const utc_offset = offsets.get(task.chat_id);
    const now = luxon.DateTime.now().setZone(utc_offset_to_timezone(utc_offset));
    if (luxon.DateTime.fromISO(task.next) < now) {
      try {
        const next = luxon.DateTime.fromISO(task.next).plus({ day: 1 });
        task.next = next.toISO();
        await telegram.send_message(config.telegram_token, {
          chat_id: task.chat_id,
          text: telegram.text(`${task.name} (alert, ${task.hour}:${task.minute}, ${next.toRelative()})`),
          parse_mode: 'MarkdownV2',
        });
      } catch (e) {
        console.error(e);
      }
    }
  }
  await proc.sleep(1000);
  process.nextTick(handle_tasks);
};
process.nextTick(handle_tasks);


/**
 * @param {import('@grammyjs/types').Update} update
 */
const handle_update = async (update) => {
  if (typeof update?.message?.text === 'string') {
    const segments = update.message.text.split(' ');
    switch (segments[0]) {
      case '/start': {
        const chat_id = update.message.chat.id;
        const text = [
          'Welcome to Weaver bot.',
          '',
          'Telegram bot for daily tasks. For personal and team use.',
          '',
          'Commands:',
          '/start - shows this intro',
          '/tz - show current time zone offset',
          '/tz [offset] - set current time zone offset',
          '/create [task-name] [hhmm] - create daily task',
          '/delete [task-name] - delete daily task',
          '/list - list daily tasks',
          '',
          'Examples:',
          '/start',
          '/tz',
          '/tz +8',
          '/create example-task 0700',
          '/delete example-task',
          '/list',
          '',
          'Notes:',
          '- default tz offset is UTC+0.',
          '- set your tz offset before creating tasks.',
          '- task-name must be in kebab-case-format.',
          '- hhmm is in military time format, 0000 to 2359.',
          '- for personal use, message the bot.',
          '- for team use, add the bot to your group. ',
        ].join('\n');
        await telegram.send_message(config.telegram_token, {
          chat_id,
          text: telegram.text(text),
          parse_mode: 'MarkdownV2',
        });
        break;
      }
      case '/tz': {
        const chat_id = update.message.chat.id;

        if (segments.length === 1) {
          const utc_offset = offsets.get(chat_id) || 0;
          await telegram.send_message(config.telegram_token, {
            chat_id,
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
          offsets.set(chat_id, offset_number);

          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(`Timezone offset set to ${utc_offset_to_timezone(utc_offset)}.`),
            parse_mode: 'MarkdownV2',
          });

        } catch (e) {
          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(e.message),
            parse_mode: 'MarkdownV2',
          });
        }
        break;
      }
      case '/create': {
        const chat_id = update.message.chat.id;
        try {
          const utc_offset = offsets.get(chat_id) || 0;

          const name = segments[1];
          assert(typeof name === 'string', 'ERR_INVALID_TASK_NAME', 'Invalid task name.');

          const time_string = segments[2];
          assert(typeof time_string === 'string', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
          assert(time_string.length === 4, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

          const time_number = Number(time_string);
          assert(typeof time_number === 'number', 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
          assert(Number.isFinite(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
          assert(Number.isInteger(time_number) === true, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
          assert(0 <= time_number, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');
          assert(time_number <= 2359, 'ERR_INVALID_TASK_TIME', 'Invalid task time.');

          const task_name_conflict = tasks.find((task) => task.chat_id === chat_id && task.name === name);
          assert(task_name_conflict === undefined, 'ERR_INVALID_TASK_NAME', 'Invalid task name.');

          const hour = Number(time_string.substring(0, 2));
          const minute = Number(time_string.substring(2, 4));

          const now = luxon.DateTime.now().setZone(utc_offset_to_timezone(utc_offset));
          const current = now.set({ hour, minute, second: 0, millisecond: 0 });
          const next = now < current ? current : current.plus({ day: 1 });

          /**
           * @type {import('./index').task}
           */
          const task = { chat_id, name, hour, minute, next: next.toISO() };
          tasks.push(task);

          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(`${name} (created, ${task.hour}:${task.minute}, ${next.toRelative()})`),
            parse_mode: 'MarkdownV2',
          });

        } catch (e) {
          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(e.message),
            parse_mode: 'MarkdownV2',
          });
        }
        break;
      }
      case '/delete': {
        const chat_id = update.message.chat.id;
        try {
          const name = segments[1];
          assert(typeof name === 'string', 'ERR_INVALID_TASK_NAME', 'Invalid task name.');
          const task_index = tasks.findIndex((task) => task.chat_id === chat_id && task.name === name);
          assert(0 <= task_index, 'ERR_INVALID_TASK', 'Invalid task.');
          tasks.splice(task_index, 1);
          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(`${name} (removed)`),
            parse_mode: 'MarkdownV2',
          });

        } catch (e) {
          await telegram.send_message(config.telegram_token, {
            chat_id,
            text: telegram.text(e.message),
            parse_mode: 'MarkdownV2',
          });
        }
        break;
      }
      case '/list': {
        const chat_id = update.message.chat.id;
        const chat_id_tasks = tasks.filter((task) => task.chat_id === chat_id).sort((a, b) => a.hour - b.hour);
        let text = 'Daily Tasks:';
        if (chat_id_tasks.length === 0) {
          text += '\n(none)';
        } else {
          chat_id_tasks.forEach((task) => {
            const next = luxon.DateTime.fromISO(task.next);
            text += `\n${task.name} (${task.hour}:${task.minute}, ${next.toRelative()})`;
          });
        }
        await telegram.send_message(config.telegram_token, {
          chat_id: chat_id,
          text: telegram.text(text),
          parse_mode: 'MarkdownV2',
        });
        break;
      }
      case '/test': {
        const chat_id = update.message.chat.id;
        await telegram.send_message(config.telegram_token, {
          chat_id,
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
};

process.nextTick(async () => {
  if (__production === true) {

    const app = uwu.uws.App({});
    app.get('/*', uwu.create_handler(async (response, request) => {
      response.json = { request };
    }));
    app.post(`/${config.telegram_token}`, uwu.create_handler(async (response, request) => {
      try {
        await handle_update(request.body.json);
      } catch (e) {
        console.error(e);
      }
      response.json = {};
    }));

    await uwu.serve_http(app, uwu.port_access_types.EXCLUSIVE, config.http_port);
    console.log('serve_http OK.');

    await telegram.delete_webhook(config.telegram_token);
    console.log('delete_webhook OK.');

    await telegram.set_webhook(config.telegram_token, {
      url: `https://${config.http_hostname}/${config.telegram_token}`,
      max_connections: 100,
      allowed_updates: ['message'],
    });
    console.log('set_webhook OK.');
  } else {
    await telegram.stream_updates(config.telegram_token, handle_update);
    console.log('stream_updates OK.');
  }
});