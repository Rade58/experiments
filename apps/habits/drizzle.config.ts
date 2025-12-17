import env from './src/env.ts'

import { defineConfig } from 'drizzle-kit'

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	//
	verbose: true,
	strict: true,
})
