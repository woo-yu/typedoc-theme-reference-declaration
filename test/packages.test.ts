import * as ts from 'typescript';
import {join} from 'path';
import {Application, DocumentationEntryPoint, LogLevel, TSConfigReader} from 'typedoc';
import {test} from 'vitest';
import {load} from '..';

const app = new Application();
app.options.addReader(new TSConfigReader());
app.bootstrap({
  tsconfig: join(__dirname, 'packages', 'tsconfig.json'),
  excludeExternals: true,
  logLevel: LogLevel.Warn,
  theme: 'reference-theme',
});
load(app);

app.converter.externalSymbolLinkMappings['global'] = {
  Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
};
app.converter.externalSymbolLinkMappings['typescript'] = {
  Promise: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
};

const program = ts.createProgram(app.options.getFileNames(), app.options.getCompilerOptions());

test('test', async () => {
  const entry: DocumentationEntryPoint = {
    displayName: 'none',
    program,
    sourceFile: program.getSourceFile(join(__dirname, 'packages/function-test/index.ts'))!,
  };

  const project = app.converter.convert([entry]);

  await app.generateJson(project, 'test/test.json');
  await app.renderer.render(project, 'test/template');
});

test('async test', async () => {
  const entry: DocumentationEntryPoint = {
    displayName: 'none',
    program,
    sourceFile: program.getSourceFile(join(__dirname, 'packages/function-test-async/index.ts'))!,
  };

  const project = app.converter.convert([entry]);

  await app.generateJson(project, 'test/test-async.json');
  await app.renderer.render(project, 'test/template-async');
});
