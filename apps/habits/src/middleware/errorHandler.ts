import type { Request, Response, NextFunction } from 'express'

import { env } from '../env.ts'

export interface CustomError extends Error {
	status?: number
	code?: string
}

// we can also create custom error classes like
// APIError for example (look at the obsidian docs, I left you notes there about it)

export class AppError extends Error {
	// message: string
	status: number
	code?: string
	name: string

	constructor(
		name: string,
		/* public  */ message: string,
		/* public  */ status: number = 500,
		/* public  */ code?: string,
	) {
		super(message)
		// we would write something like this
		// this.name = this.constructor.name
		// but now to save time let's just take name passed in
		// xonstructor
		this.name = name
		//
		this.status = status
		this.code = code
		// this.message = message
		Error.captureStackTrace(this, this.constructor)
	}
}

export function errorHandler(
	err: CustomError,
	req: Request,
	res: Response,
	_next: NextFunction,
) {
	console.error(err.stack)

	// default error
	let status = err.status || 500

	let message = err.message || 'Internal Server Error'

	// Handle specific error types
	if (err.name === 'ValidationError') {
		status = 400
		message = 'Validation Error'
	}

	if (err.name === 'UnauthorizedError') {
		status = 401
		message = 'Unauthorized'
	}

	//
	res.status(status).json({
		error: message,
		...(env.APP_STAGE === 'dev' && {
			stack: err.stack,
			details: err.message,
		}),
	})
}

export function notFound(req: Request, res: Response, next: NextFunction) {
	const error = new Error(`Not found - ${req.originalUrl}`) as CustomError
	error.status = 404
	next(error)
}
