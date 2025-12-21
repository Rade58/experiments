import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type Payload } from '../utils/auth/jwt.ts'

// I tried doing this (again got typescript errors
// so I don't have time to fix it so you check here for
// better solution
//     documents/2. api stuff/1. Type Handler or Request.md
//     documents/2. api stuff/2. Zod schema per route.md
// )
// I added two generics because sometimes requests body
// containes more things that we need
export interface AuthenticatedRequest<T = {}, S = {}, U = {}> extends Request<
	U,
	{},
	T & S
> {
	// why optional when we are inseting it
	// and we want to use this in crud controllers
	// user?: Payload
	// so better not be optional
	// but typescript would yell
	// when we try to pass this as a middleware
	//  so we will not set this type on request here
	user: Payload
}
// but this is better:

export async function authenticateToken(
	// req: AuthenticatedRequest,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const authHeader = req.headers.authorization

		// Bearer token
		const token = authHeader && authHeader.split(' ')[1]

		if (!token) {
			return res.status(401).json({ error: 'Access token required!' })
		}

		const payload = await verifyToken(token)

		;(req as AuthenticatedRequest).user = payload

		next()
	} catch /* (err) */ {
		// don't log token, maybe err can have token
		// for security reasons don't log token
		// console.error('Token error: ', err)
		return res.status(403).json({ error: 'Invalid or expired token!' })
	}
}
