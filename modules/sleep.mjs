// @ts-check

import { assert } from './assert.mjs';

/**
 * @param {number} timeout
 */
export const sleep = async (timeout) => {
  assert(typeof timeout === 'number');
  await new Promise((resolve) => setTimeout(resolve, timeout));
};