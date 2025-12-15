import express from 'express'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import { env, /* isDev, */ isTestEnv } from './env.ts'
import { health } from './health.ts'

//
import authRouter from './routes/authRoutes.ts'
import userRouter from './routes/userRoutes.ts'
import habitRouter from './routes/habitRoutes.ts'
//

// we would need to type this if we
// would use declaration: true in tsconfig.json
// but we this is not a library
const app /* : express.Application */ /* : express.Express */ = express()

// -----------------------------------------------
app.use(helmet())
// we would use this if we would allow only selected origins
// to hit our api
app.use(
	cors({
		origin: env.CORS_ORIGIN,
		credentials: true,
	}),
)
// this opens everything (every domain is allowed to hit our api)
// app.use(cors()); // bad for security (only use if this is public facing api)
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	morgan('dev', {
		skip: () => isTestEnv(),
	}),
)

// -----------------------------------------------
// Health check endpoint
app.get('/health', health)
// ------------------------------------------------

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/habits', habitRouter)

// ------------------------------------------------
/* if (env.FEATURE_ANALYTICS) {
  app.use('/api/analytics', analyticsRoutes)
}*/

export { app } // for tests

export default app // for convenience
