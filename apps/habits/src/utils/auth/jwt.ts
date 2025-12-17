import { SignJWT, type JWTPayload } from 'jose'
import { createSecretKey } from 'node:crypto'
import { env } from '../../env.ts'

interface Payload extends JWTPayload {
	id: string
	email: string
	username: string
}

export const generateToken = (payload: Payload) => {
	const secret = env.JWT_SECRET
	const secretKey = createSecretKey(secret, 'utf-8')

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(env.JWT_EXPIRES_IN || '7d')
		.sign(secretKey)
}
