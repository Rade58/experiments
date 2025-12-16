import type { Request, Response, NextFunction } from 'express'
import { z, type ZodType, ZodError } from 'zod' // ZodSchema deprecated
import env from '../env.ts'

/**
 *
 * @param schema zod schema
 * @returns request handler
 * @description Middleware for validating request body
 */
export function validateBody<T extends ZodType>(schema: T) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const validatedData = schema.parse(req.body)

			req.body = validatedData

			next()
		} catch (err) {
			if (err instanceof ZodError) {
				// but why not add this, only in case of development
				if (env.APP_STAGE === 'dev') {
					// for debugging purposes
					console.error({ fieldErrors: z.flattenError(err).fieldErrors })
				}
				// important that we return here because we
				// don't want to call next in this case
				// since we are sending error response to client
				// and possible middleware in a que after current one
				// should not be called
				return res.status(400).json({
					error: 'Body Validation Failed!',
					details: err.issues.map((e) => ({
						field: e.path.join('. '),
						message: e.message,
					})),
				})
			}
			next(err) // I guess this won't ever be reached
			// because we can only fail in this function
			// if schema parsing fail (a ZodError instance is thrown)
		}
	}
}

/**
 *
 * @param schema zod schema
 * @returns request handler
 * @description Middleware for validating request params
 */
export function validateParams<T extends ZodType>(schema: T) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.params)
			next()
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					error: 'Params Validation Failed!',
					details: err.issues.map((e) => ({
						field: e.path.join('. '),
						message: e.message,
					})),
				})
			}
			next(err)
		}
	}
}

/**
 *
 * @param schema zod schema
 * @returns request handler
 * @description Middleware for validating request query params
 */
export function validateQueryParams<T extends ZodType>(schema: T) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.query)
			next()
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({
					error: 'Query Params Validation Failed!',
					details: err.issues.map((e) => ({
						field: e.path.join('. '),
						message: e.message,
					})),
				})
			}
			next(err)
		}
	}
}
