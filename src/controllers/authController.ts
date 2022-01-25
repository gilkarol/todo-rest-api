import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import User from '../models/user'

export const signup = async (req: any, res: any, next: any) => {
	const name = req.body.name
	const email = req.body.email
	const password = req.body.password

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		throw new Error('Validation failed!')
	}

	try {
		const emailExist = await User.findOne({ email: email })
		if (emailExist) throw new Error('Email already exists!')

		const hashedPassword = await hash(password, 12)
		const user = new User({
			name: name,
			email: email,
			password: hashedPassword,
		})
		await user.save()
		res.status(201).json({
			message: 'User created successfully!',
		})
	} catch (err) {
		throw err
	}
}

export const login = async (req: any, res: any, next: any) => {
	const email = req.body.email
	const password = req.body.password

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		throw new Error('Validation failed!')
	}

	try {
		const user = await User.findOne({ email: email })
		if (!user) throw new Error('User with this email does not exist!')

		const isEqual = await compare(password, user.password)
		if (!isEqual) throw new Error('Password does not match!')
		const token = sign(
			{ email: user.email, userId: user._id.toString() },
			'secrettoken',
			{ expiresIn: '1h' }
		)
		res.status(200).json({ message: 'Successfully logged in!', token: token })
	} catch (err) {
		throw err
	}
}
