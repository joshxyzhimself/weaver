// @ts-check

import fetch from 'node-fetch';
import { assert } from './assert.mjs';
import { sleep } from './sleep.mjs';

/**
 * @type {import('./telegram').endpoint}
 */
export const endpoint = (token, method) => {
  assert(typeof token === 'string');
  assert(typeof method === 'string');
  return `https://api.telegram.org/bot${token}/${method}`;
};


/**
 * @type {import('./telegram').post}
 */
export const post = async (url, body) => {
  assert(typeof url === 'string');
  assert(body instanceof Object);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  assert(response.status === 200);
  const json = await response.json();
  return json;
};

/**
 * @type {import('./telegram').send_message}
 */
export const send_message = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  assert(typeof body.text === 'string');
  const response = await post(endpoint(token, 'sendMessage'), body);
  return response;
};


/**
 * @type {import('./telegram').delete_message}
 */
export const delete_message = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.chat_id === 'number');
  assert(typeof body.message_id === 'number');
  const response = await post(endpoint(token, 'deleteMessage'), body);
  return response;
};


/**
 * @type {import('./telegram').set_webhook}
 */
export const set_webhook = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(typeof body.url === 'string');
  assert(typeof body.max_connections === 'number');
  assert(body.allowed_updates instanceof Array);
  const response = await post(endpoint(token, 'setWebhook'), body);
  return response;
};


/**
 * @type {import('./telegram').delete_webhook}
 */
export const delete_webhook = async (token) => {
  assert(typeof token === 'string');
  const response = await post(endpoint(token, 'deleteWebhook'), {});
  return response;
};


/**
 * @type {import('./telegram').get_updates}
 */
export const get_updates = async (token, body) => {
  assert(typeof token === 'string');
  assert(body instanceof Object);
  assert(body.offset === undefined || typeof body.offset === 'number');
  assert(body.allowed_updates instanceof Array);
  const response = await post(endpoint(token, 'getUpdates'), body);
  assert(response instanceof Object);
  assert(response.ok === true);
  assert(response.result instanceof Array);
  return response.result;
};


/**
 * @type {import('./telegram').stream_updates}
 */
export const stream_updates = async (token, on_update) => {
  assert(typeof token === 'string');
  assert(on_update instanceof Function);
  await delete_webhook(token);
  const stream_update = async (offset) => {
    assert(offset === undefined || typeof offset === 'number');
    const updates = await get_updates(token, { offset, allowed_updates: ['message'] });
    for (let i = 0, l = updates.length; i < l; i += 1) {
      const update = updates[i];
      try {
        await on_update(update);
      } catch (e) {
        console.error(e);
      }
    }
    await sleep(1000);
    const next_offset = updates.length === 0 ? undefined : updates[updates.length - 1].update_id + 1;
    process.nextTick(stream_update, next_offset);
  };
  process.nextTick(stream_update);
};


/**
 * @type {import('./telegram').code}
 */
export const code = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`');
};


/**
 * @type {import('./telegram').text}
 */
export const text = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
};


/**
 * @type {import('./telegram').url}
 */
export const url = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\)/g, '\\)');
};