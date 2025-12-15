import express from 'express'

// I had pnpm error every time I build
// if I don't set explicit type here
const app: express.Application /* : express.Express */ = express()

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
