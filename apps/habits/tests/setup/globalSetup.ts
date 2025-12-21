import { db } from '../../src/db/connection.ts'
import { users, habits, entries, tags, habitTags } from '../../src/db/schema.ts'
import { sql } from 'drizzle-orm'
import { execSync } from 'child_process'

export default async function setup() {
	console.log('🗄️  Setting up test database...')

	// Rade: I added this to not mess things up
	// afraid I'm going to hit dev datbase instead of test one
	console.log('Current NODE_ENV:', process.env.NODE_ENV)

	/* if (process.env.NODE_ENV !== 'test') {
		//
		// throw new Error(
		// 	'NODE_ENV is not set to test! Aborting test database setup to prevent data loss.',
		// )
		console.log('⚠️  Warning: NODE_ENV is not set to test! Seed is aborting.')
		return
	}
	if (process.env.APP_STAGE !== 'test') {
		//
		// throw new Error(
		// 	'NODE_ENV is not set to test! Aborting test database setup to prevent data loss.',
		// )
		console.log('⚠️  Warning: APP_STAGE is not set to test! Seed is aborting.')
		return
	} */
	// ---------------------------------------------------------

	try {
		// Drop all tables if they exist to ensure clean state
		await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
		await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
		await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
		await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
		await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)

		// Use drizzle-kit CLI to push schema to database
		console.log('🚀 Pushing schema using drizzle-kit...')
		execSync(
			// Rade: I had problems with this
			// `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
			// env variables were loading from .env.dev instead of .env.test
			// so I passed APP_STAGE
			`cross-env APP_STAGE="test" npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
			{
				stdio: 'inherit',
				cwd: process.cwd(),
			},
		)

		console.log('✅ Test database setup complete')
	} catch (error) {
		console.error('❌ Failed to setup test database:', error)
		throw error
	}

	return async () => {
		console.log('🧹 Tearing down test database...')

		try {
			// Final cleanup - drop all test data
			await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
			await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
			await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)

			console.log('✅ Test database teardown complete')
			process.exit(0)
		} catch (error) {
			console.error('❌ Failed to teardown test database:', error)
		}
	}
}
