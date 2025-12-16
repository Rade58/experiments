import { Router, type Request, type Response } from 'express'
import { z } from 'zod'

import {
	validateBody,
	validateParams,
	// validateQueryParams,
} from '../middleware/validation.ts'

// --------------------------------------------
export const createHabitSchema = z.object({
	name: z.string().nonoptional(),
})

export const completeHabitSchema = z.object({
	id: z.coerce.number(),
})
// --------------------------------------------

const router = Router()

router.get('/', (req, res) => {
	res.json({ message: 'Get all habits' })
})

// you can use array but handler will not be typed
// so you must type it by yourseld
// so I guess I will restrain from putting middleware
// in array
router.post('/', [validateBody(createHabitSchema)], (req: Request, res: Response) => {
	res.status(201).json({ message: 'Habit created' })
})

router.post('/:id/completed', validateParams(completeHabitSchema), (req, res) => {
	res.json({ message: `Habit ${req.params.id} complete` })
})

router.get('/:id/stats', (req, res) => {
	res.json({ message: `Get stats for habit ${req.params.id}` })
})

router.delete('/:id', (req, res) => {
	res.status(204).json({ message: `Habit ${req.params.id} deleted` })
})

export default router
