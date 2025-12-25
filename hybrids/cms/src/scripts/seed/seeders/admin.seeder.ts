import { getPayload /*  ValidationError, type ValidationErrorName  */ } from 'payload'

import config from '@/payload.config'
import { isDuplicateUserError } from '../lib/is-duplicate-error'

import z, { ZodError } from 'zod'
import { env } from '@/env/server'

export async function seedAdmin() {
	const payloadClient = await getPayload({ config })

	try {
		/* const emailAndPassword = envSchema.parse({
			email: process.env.DUMMY_EMAIL,
			password: process.env.DUMMY_PASSWORD,
		}) */

		const response = await payloadClient.create({
			collection: 'users',
			data: {
				// email: emailAndPassword.email,
				// password: emailAndPassword.password,
				email: env.DUMMY_EMAIL,
				password: env.DUMMY_PASSWORD,
			},
		})

		console.log('Admin user created:', { response })
	} catch (err) {
		if (isDuplicateUserError(err)) {
			console.log('Admin User with that email already exists')
			// console.error('Error! seeding admin user: ', JSON.stringify(err, null, 2))
		} else if (err instanceof ZodError) {
			console.error(z.flattenError(err))
		} else {
			console.error('Error! seeding admin user: ', JSON.stringify(err, null, 2))
		}
	}
}
