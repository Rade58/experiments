import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		DATABASE_URL: z.url().startsWith('postgresql://').nonoptional(),
		PAYLOAD_SECRET: z.string().min(24).max(24).nonoptional(),
		//
		DUMMY_EMAIL: z.email().nonoptional(),
		DUMMY_PASSWORD: z.string().min(4).max(20).nonoptional(),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
		DUMMY_EMAIL: process.env.DUMMY_EMAIL,
		DUMMY_PASSWORD: process.env.DUMMY_PASSWORD,
	},
})
