/* eslint-disable no-console */

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
  fix?: {
    range: [number, number];
    text: string;
  };
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
// eslint-disable-next-line antfu/no-top-level-await
const errorsByName = await parseFile();

const errorsByNameSorted = Object
  .entries(errorsByName)
  .sort(([,a], [,b]) => a.length - b.length);
printCleanErrors(errorsByNameSorted);

export async function parseFile(): Promise<{
  [key: string]: (Message & { filePath: string; })[];
}> {
  const file = await readFile('eslint.json');
  console.log('File read');
  const content: FileInfo[] = JSON.parse(file.toString());
  console.log('Parsed content', content.length);
  const contentWithErrors = content.filter(item => item.errorCount > 0);
  console.log('Filtered content with errors', contentWithErrors.length);
  const errors = contentWithErrors.flatMap(item => item.messages.map(message => ({
    ...message,
    filePath: item.filePath,
  }))).filter(item => item.severity === 2 && !item.fix);
  console.log('Errors', errors.length);
  return errors.reduce<{
    [key: string]: (Message & { filePath: string; })[];
  }>((acc, error) => {
        if (error.ruleId in acc) {
          acc[error.ruleId].push(error);
        }
        else {
          acc[error.ruleId] = [error];
        }
        return acc;
      }, {});
}

function printCleanErrors(errors: [string, (Message & {
  filePath: string;
})[]][]) {
  errors.forEach(([name, errors]) => {
    console.log('--------------------');
    console.log(name, errors.length);
    console.log();
    errors.forEach((error) => {
      console.log(' - ', `${error.filePath}@${error.line}:${error.column}`);
    });
  });
}
