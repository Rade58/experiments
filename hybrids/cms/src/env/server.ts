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
	experimental__runtimeEnv: process.env,
})
