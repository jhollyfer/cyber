import { defineConfig, NormalizedOptions } from 'tsup';

export default defineConfig({
  entry: [
    'application/**/*.ts',
    'bin/**/*.ts',
    'config/**/*.ts',
    'start/**/*.ts',
    '!**/*.spec.ts',
  ],
  ignoreWatch: ['node_modules'],
  outDir: 'build',
  target: 'es2024',
  format: ['esm'],
  splitting: true,
  swc: {
    jsc: {
      parser: {
        syntax: 'typescript',
        decorators: true,
        dynamicImport: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
      },
      target: 'es2024',
    },
  } as NormalizedOptions['swc'],
});
