import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { createSecretKey } from 'node:crypto'
import { env } from '../../env.ts'

export interface Payload extends JWTPayload {
	id: string
	email: string
	username: string
}

export const generateToken = (payload: Payload): Promise<string> => {
	const secret = env.JWT_SECRET
	const secretKey = createSecretKey(secret, 'utf-8')

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(env.JWT_EXPIRES_IN || '7d')
		.sign(secretKey)
}

export const verifyToken = async (token: string): Promise<Payload> => {
	const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
	const { payload } = await jwtVerify<Payload>(token, secretKey)

	return payload
}
