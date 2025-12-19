import type { Request, Response } from 'express'
// import bcrypt from 'bcrypt' // used in helper
import { generateToken } from '../utils/auth/jwt.ts'
import { hashPassword } from '../utils/auth/password.ts'
import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
// import { env } from '../env.ts' // used in helper

export const register = async (req: Request<{}, {}, NewUser>, res: Response) => {
	try {
		const { password /* , email, username, firstName, lastName */ } = req.body

		// Hash password with configurable rounds
		// why use process.env when you already defined env.ts?
		// const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
		// so we can access it like this
		// const saltRounds = env.BCRYPT_ROUNDS
		//
		// why use this when we already defined helper
		// const hashedPass = await bcrypt.hash(password, saltRounds)
		// function is already reading SALT ROUNDS from env in
		// fuction dfinition
		const hashed = await hashPassword(password /* , saltRounds */)

		// Create new user
		const [newUser] = await db
			.insert(users)
			.values({
				/* username,
				email,
				firstName,
				lastName, */
				...req.body,
				password: hashed,
			})
			.returning({
				// don't want password
				id: users.id,
				email: users.email,
				username: users.username,
				firstName: users.firstName,
				lastName: users.lastName,
				createdAt: users.createdAt,
			})

		// generate JWT for auto-login
		const token = await generateToken({
			id: newUser.id,
			email: newUser.email,
			username: newUser.username,
		})

		//
		res.status(201).json({
			message: 'User created successfully',
			user: newUser,
			token, //User is logged in immediately
		})
	} catch (err) {
		console.error('Registration error: ', err)

		// but we should query for existing email
		// it is better approach (read documents/ai points/registering concerns.md)

		// if someone tried to register but it is already done that
		// in the past
		// Check for unique constraint violation

		// don't know if this works
		/* if (err && typeof err === 'object' && 'code' in err) {
			// PostgreSQL unique violation error code
			if (err.code === '23505') {
				return res.status(409).json({
					error: 'User with this email or username already exists',
				})
			}
		} */

		res.status(500).json({ error: 'Failed to create user' })
	}
}
