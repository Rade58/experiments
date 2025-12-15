import express from 'express'

// we would need to type this if we
// would use declaration: true in tsconfig.json
// but we this is not a library
const app /* : express.Application */ /* : express.Express */ = express()

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		service: 'Habits API',
	})
})

export { app }

export default app
