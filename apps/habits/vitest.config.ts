import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		// todo: add setup file if needed
		// globalSetup: ['./tests/setup/globalSetup.ts'],
		// cleanup to ensure isolation
		clearMocks: true,
		restoreMocks: true,
		// avoid datbase conflicts with sequential
		pool: 'threads',
		// --  deprecated --
		/* poolOptions: {
      threads: {
        singleThread: true
      }
    } */
		// --  use this instead --
		maxWorkers: 1,
	},
	plugins: [],
})
