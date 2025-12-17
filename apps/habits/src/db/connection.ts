import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { remember } from '@epic-web/remember'
import { env, isProd } from '../env.ts'
import * as schema from './schema.ts'

const createPool = (): Pool => {
	return new Pool({
		connectionString: env.DATABASE_URL,
	})
}

let client: Pool

if (isProd()) {
	client = createPool()
} else {
	client = remember('dbPool', () => {
		return createPool()
	})
}

export const db = drizzle({ client, schema })
export default db
