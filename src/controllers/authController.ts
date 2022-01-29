import { NextFunction, Response } from 'express'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { validationResult } from 'express-validator'

import User from '../models/user'
import { Err, Req } from '../util/interfaces'

export const signup = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const name: string = req.body.name
	const email: string = req.body.email
	const password: string = req.body.password

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error: Err = new Error('Email already exists!')
		error.status = 422
		throw error
	}

	try {
		const emailExist = await User.findOne({ email: email })
		if (emailExist) {
			const error: Err = new Error('Email already exists!')
			error.status = 409
			throw error
		}

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
		next(err)
	}
}

export const login = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const email: string = req.body.email
	const password: string = req.body.password

	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const error: Err = new Error('Email already exists!')
		error.status = 422
		throw error
	}

	try {
		const user = await User.findOne({ email: email })
		if (!user) {
			const error: Err = new Error('This email does not exist!')
			error.status = 404
			throw error
		}

		const isEqual = await compare(password, user.password)
		if (!isEqual) {
			const error: Err = new Error('Passwords does not match!')
			error.status = 422
			throw error
		}
		const token = sign(
			{ email: user.email, userId: user._id.toString() },
			process.env.JWT_TOKEN as string,
			{ expiresIn: '1h' }
		)
		res.status(200).json({ message: 'Successfully logged in!', token: token })
	} catch (err) {
		next(err)
	}
}
