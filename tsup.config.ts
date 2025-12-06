import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tokens/index': 'src/tokens/index.ts',
    'icons/hour/index': 'src/icons/hour/index.ts',
    'icons/minute7/index': 'src/icons/minute7/index.ts',
    'icons/lmntl/index': 'src/icons/lmntl/index.ts',
    'icons/mcs/index': 'src/icons/mcs/index.ts',
    'components/index': 'src/components/index.ts',
    'tailwind-preset': 'src/tailwind-preset.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
