/* eslint-disable no-console */
/* eslint-disable antfu/no-top-level-await */
import { readFile, writeFile } from 'node:fs/promises';
import { parseFile } from './check_eslint.ts';

const parsed = await parseFile();
const unusedRef = parsed['vue/no-unused-refs'];

for (const message of unusedRef) {
  console.log('manage', message.filePath);
  const file = await readFile(message.filePath, 'utf-8');
  const fileSplit = file.toString().split('\n');
  console.log(fileSplit[message.line - 1]);
  fileSplit[message.line - 1] = fileSplit[message.line - 1].replace(/ref="\w+"/g, '');
  await writeFile(message.filePath, fileSplit.join('\n'), 'utf-8');
}
