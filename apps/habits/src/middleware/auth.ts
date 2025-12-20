import type { Request, Response, NextFunction } from 'express'
import { verifyToken, type Payload } from '../utils/auth/jwt.ts'

//
export interface AuthenticatedRequest extends Request {
	user?: Payload
}

export async function authenticateToken(
	req: AuthenticatedRequest,
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

		req.user = payload

		next()
	} catch (err) {
		console.error('Token error: ', err)
		return res.status(403).json({ error: 'Invalid or expired token!' })
	}
}
