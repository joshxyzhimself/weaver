// @ts-check

import fs from 'fs';
import path from 'path';
import assert from 'assert';

const app_config_path = path.join(process.cwd(), './config.json');

/**
 * @type {import('./config').config}
 */
export const config = JSON.parse(fs.readFileSync(app_config_path, { encoding: 'utf-8' }));

assert(typeof config.port === 'number');
assert(typeof config.postgresql_host === 'string');
assert(typeof config.postgresql_port === 'number');
assert(typeof config.postgresql_username === 'string');
assert(typeof config.postgresql_password === 'string');
assert(typeof config.postgresql_database === 'string');