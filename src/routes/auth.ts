import { Router } from 'express'
import { body } from 'express-validator'

import { signup, login } from '../controllers/authController'

const router = Router()

router.post('/signup', [
	body('email').isEmail(),
	body('name').not().isEmpty(),
	body('password').trim().isLength({ min: 7 }),
], signup)

router.post('/login', [
	body('email').isEmail(),
	body('password').trim().isLength({ min: 7 }),
], login)

export default router
