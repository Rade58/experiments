import type { RequestHandler } from 'express'

export const health: RequestHandler = (_, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'Habits API',
	})
}
