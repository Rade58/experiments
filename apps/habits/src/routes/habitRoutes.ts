import { Router /* type Request, type Response */ } from 'express'
import { z } from 'zod'

import {
	validateBody,
	validateParams,
	// validateQueryParams,
} from '../middleware/validation.ts'
import { authenticateToken } from '../middleware/auth.ts'

import {
	createHabit,
	deleteHabit,
	getHabitById,
	getUserHabits,
	updateHabit,
} from '../controllers/habitController.ts'

// --------------------------------------------
export const createHabitSchema = z.object({
	name: z.string().nonoptional(),
})

export const completeHabitSchema = z.object({
	id: z.coerce.number(),
})
// --------------------------------------------

const router = Router()

// Applying authentication to all routes bellow
router.use(authenticateToken)
//

/* router.get('/', (req, res) => {
	res.json({ message: 'Get all habits' })
}) */

// isnstead of using expect error and all of this
// rad this to properly type express handlers
// better solution
//     documents/2. api stuff/1. Type Handler or Request.md
//     documents/2. api stuff/2. Zod schema per route.md
//

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.get('/', getUserHabits)

// you can use array but handler will not be typed
// so you must type it by yourseld
// so I guess I will restrain from putting middleware
// in array
// not sure if array is worth it in this case,
// just showing how to do it
// router.post('/', [validateBody(createHabitSchema)], (req: Request, res: Response) => {
/* router.post('/', validateBody(createHabitSchema), (req, res) => {
	res.status(201).json({ message: 'Habit created' })
}) */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.post('/', validateBody(createHabitSchema), createHabit)

router.post('/:id/completed', validateParams(completeHabitSchema), (req, res) => {
	res.json({ message: `Habit ${req.params.id} complete` })
})
// router.post('/:id/completed', validateParams(completeHabitSchema), updateHabit)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.patch('/:id', updateHabit)

/* router.get('/:id/stats', (req, res) => {
	res.json({ message: `Get stats for habit ${req.params.id}` })
}) */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.get('/:id/stats', getHabitById)

/* router.delete('/:id', (req, res) => {
	res.status(204).json({ message: `Habit ${req.params.id} deleted` })
}) */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
router.delete('/:id', deleteHabit)

export default router
