import { z } from 'zod'

// @ts-expect-error custom-env has no types declaration (because we have 'strict' in tsconfig noImplicitAny is applied)
import { env as loadEnv } from 'custom-env'

process.env.APP_STAGE = process.env.APP_STAGE || 'dev'

const isDevelopment = process.env.APP_STAGE === 'dev'
const isTesting = process.env.APP_STAGE === 'test'
const isProduction = process.env.APP_STAGE === 'production'

// console.log(isDevelopment, isTesting, isProduction);

if (isDevelopment) {
	// instead of this
	// loadEnv(); // this is loading .env
	// I wanted to use this
	// eslint-disable-next-line
	loadEnv('dev') // this is loading .env.dev
} else if (isTesting) {
	// eslint-disable-next-line
	loadEnv('test') // this is loading .env.test
} else if (isProduction) {
	console.log('production -> no loading of env files')
	// no loading .env files in production
} else {
	console.log('probably staging')
}

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
	APP_STAGE: z.enum(['dev', 'test', 'production']).default('dev'),
	PORT: z.coerce.number().positive().default(3000),
	// HOST: z.string().default('localhost'),
	DATABASE_URL: z.string().startsWith('postgresql://'),
	// DATABASE_POOL_MIN: z.coerce.number().min(0).default(2),
	// DATABASE_POOL_MAX: z.coerce.number().positive().default(isProduction ? 50:10),
	JWT_SECRET: z.string().min(32, 'Must be 32 char long'),
	JWT_EXPIRES_IN: z.string().default('7d'),
	// REFRESH_TOKEN_SECRET: z.string().min(32).optional(),
	// REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
	BCRYPT_ROUNDS: z.coerce.number().min(10).max(20).default(12),
	// ----------------------------------------------------------
	CORS_ORIGIN: z
		.string()
		.or(z.array(z.string()))
		.transform((val) => {
			if (typeof val === 'string') {
				return val.split(',').map((origin) => origin.trim())
			}
			return val
		})
		.default([]),
	// --------------------------------------------------------
	/* LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug', 'trace'])
    .default(isProduction ? 'info' : 'debug'), */

	/*  RATE_LIMIT_WINDOW: z.coerce
    .number()
    .positive()
    // 15min prod  1min development
    .default(isProduction ? 900000 : 60000),
 */
	// ------------ Feature flags ------------
	/* FEATURE_ANALYTICS: z.coerce.boolean().default(false),
  FEATURE_SOCIAL: z.coerce.boolean().default(false),
  FEATURE_PREMIUM: z.coerce.boolean().default(false),
  */

	// --------------- Version-specific features
	// API_VERSION: z.string().default("v1"),
})

export type Env = z.infer<typeof envSchema>

let env: Env

try {
	env = envSchema.parse(process.env)
} catch (e) {
	if (e instanceof z.ZodError) {
		console.log(' ---- Invalid env var! ----')
		// console.error(JSON.stringify(e.flatten().fieldErrors, null, 2)); // deprecated
		console.error(z.flattenError(e).fieldErrors)

		e.issues.forEach((err) => {
			const path = err.path.join('. ')
			console.log({ path })
			console.log(`${path} -> ${err.message}`)
			console.log('---------------------')
		})

		process.exit(1)
	}

	throw e
}

export const isProd = () => env.APP_STAGE === 'production'
export const isDev = () => env.APP_STAGE === 'dev'
export const isTestEnv = () => env.APP_STAGE === 'test'

export { env }
export default env
