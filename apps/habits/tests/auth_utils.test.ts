import { verifyToken } from '../src/utils/auth/jwt.ts'

describe('Authentication util functions', () => {
	it('should work', async () => {
		const token = ''

		const data = await verifyToken(token)

		expect(data).toBeTypeOf('string')
	})
})
