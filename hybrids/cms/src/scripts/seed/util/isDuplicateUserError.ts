// import { z} from 'zod'

import { ValidationError } from 'payload'

function isPayloadValidationError(err: unknown): err is ValidationError {
	return (
		!!err && typeof err === 'object' && 'name' in err && err.name === ValidationError.name
	)
}

export function isDuplicateUserError(err: unknown) {
	const validationErr = isPayloadValidationError(err)

	// if (!(err instanceof ValidationError)) return false
	if (!validationErr) return false
	if (!err.data.collection) return false
	if (err.data.collection !== 'users') return false
	if (
		err.data.errors.some(({ path, message }) => {
			const isRow = path === 'email'
			const isDup = /already registered/i.test(message)
			return isRow && isDup
		})
	) {
		return true
	}

	return false
}
