import bcrypt from 'bcrypt'
import { env } from '../../env.ts'

export const hashPassword = async (pass: string): Promise<string> => {
	return bcrypt.hash(pass, env.BCRYPT_ROUNDS)
}

export const comparePasswords = async (
	password: string,
	hash: string,
): Promise<boolean> => {
	return bcrypt.compare(password, hash)
}
