/* eslint-disable antfu/no-top-level-await */
import { readFile } from 'node:fs/promises';

console.log('Checking ESLint configuration...');
interface Message {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: null;
  messageId: string;
  endLine: number;
  endColumn: number;
}
interface FileInfo {
  filePath: string;
  messages: Message[];
  suppressedMessages: Message[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  usedDeprecatedRules: unknown[];
  source: string;
}
const file = await readFile('eslint.json');
console.log('File read');
const content: FileInfo[] = JSON.parse(file.toString());
console.log('Parsed content', content.length);
const contentWithErrors = content.filter(item => item.errorCount > 0);
console.log('Filtered content with errors', contentWithErrors.length);
const errors = contentWithErrors.flatMap(item => item.messages.map(message => ({
  ...message,
  filePath: item.filePath,
}))).filter(item => item.severity === 2);
console.log('Errors', errors.length);
const errorsByName = errors.reduce<{
  [key: string]: Message[];
}>((acc, error) => {
  if (error.ruleId in acc) {
    acc[error.ruleId].push(error);
  }
  else {
    acc[error.ruleId] = [error];
  }
  return acc;
}, {});
console.log('Errors by name', Object
  .entries(errorsByName)
  .sort(([,a], [,b]) => b.length - a.length)
  .map(([key, value]) => ({ key, value: value.length })));
// console.log('specific error', errorsByName['vue/custom-event-name-casing']);
