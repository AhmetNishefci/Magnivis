import {defineConfig} from 'vitest/config';

// Ignored clean-clone/scratch directories must not duplicate the canonical suite.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    // Several suites hash full durable media; bound file-level concurrency to avoid
    // disk/CPU contention exhausting unchanged per-test timeouts on larger catalogs.
    // Serial file execution keeps the growing canonical-media audit within its
    // existing timeout without weakening assertions or increasing time budgets.
    maxWorkers: 1,
  },
});
