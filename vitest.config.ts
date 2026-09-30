import {defineConfig} from 'vitest/config';

// Ignored clean-clone/scratch directories must not duplicate the canonical suite.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
