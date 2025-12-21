import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		//
		env: {
			// In workshop this wasn't set up properly
			// I think loding env file we define:
			// apps/habits/src/env.ts
			// needs a rewrite or we just set APP_STAGE here
			APP_STAGE: 'test',
			// I think workshop author forgot this actually
			//
			//
		},
		globals: true,
		// todo: add setup file if needed
		globalSetup: ['./tests/setup/globalSetup.ts'],
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
