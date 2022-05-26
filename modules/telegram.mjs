// @ts-check

import assert from 'assert';
import fetch from 'node-fetch';

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
  console.log({ body });
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  console.log({ json });
  assert(response.status === 200);
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
 *
 * @param {string} value
 * @returns {string}
 */
const code = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`');
};


/**
 *
 * @param {string} value
 * @returns {string}
 */
const url = (value) => {
  assert(typeof value === 'string');
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\)/g, '\\)');
};


/**
 *
 * @param {string} value
 * @returns {string}
 */
const text = (value) => {
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