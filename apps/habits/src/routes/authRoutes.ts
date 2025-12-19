import { Router } from 'express'

//
import { register } from '../controllers/authControler.ts'
import { validateBody } from '../middleware/validation.ts'
// if we need something special
// for example validating that email is of
// specific domain
// or something that would require regex to check for us,
// then we would need to build our own schema
import { insertUserSchema } from '../db/schema.ts'
// but also we can use extend
//  Example: (tried this but doesn't seem to work)
/* import z from 'zod'
insertUserSchema.extend({
	email: z
		.email()
		.endsWith('blah.com', { message: 'Email must be of blah.com domain' })
		.nonoptional(),
	additionalField: z.string().min(2).max(50).nonoptional(),
})
 */
// to be honest, this vlidation provided by your db schema is
//not that usefull, it would be better that we define outr ovn schema
// because in this case email with wrong format will end up in
// database

const router = Router()

// router.post('/register', (req, res) => {
// 	res.status(201).json({ message: 'User registered' })
// })
router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', (req, res) => {
	res.json({ message: 'User logged in' })
})

router.post('/logout', (req, res) => {
	res.json({ message: 'User logged out' })
})

router.post('/refresh', (req, res) => {
	res.json({ message: 'Token refreshed' })
})

export default router
