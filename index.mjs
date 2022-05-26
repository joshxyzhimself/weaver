// @ts-check

import * as telegram from './modules/telegram.mjs';
import * as uwu from './modules/uwu.mjs';
import { config } from './modules/config.mjs';


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __production = process.argv.includes('--production');

// goals
// create record
// update record
// delete record

// /add
// /update

console.log({ config });