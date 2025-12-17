import bcrypt from 'bcrypt'
import { env } from '../../env.ts'

export const hashPassword = async (pass: string) => {
	return bcrypt.hash(pass, env.BCRYPT_ROUNDS)
}
