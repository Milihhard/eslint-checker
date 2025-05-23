/* eslint-disable no-console */
/* eslint-disable antfu/no-top-level-await */
import { readFile, writeFile } from 'node:fs/promises';
import { parseFile } from './check_eslint.ts';

const parsed = await parseFile();
const unusedImport = parsed['unused-imports/no-unused-vars'];
const unusedImportError = unusedImport.filter((item) => {
  return item.message.startsWith('\'e\'') || item.message.startsWith('\'err\'') || item.message.startsWith('\'error\'');
});

for (const message of unusedImportError) {
  console.log('manage', message.filePath);
  const file = await readFile(message.filePath, 'utf-8');
  const fileSplit = file.toString().split('\n');
  fileSplit[message.line - 1] = fileSplit[message.line - 1].replace(/\(.+\) /g, '');
  await writeFile(message.filePath, fileSplit.join('\n'), 'utf-8');
}
