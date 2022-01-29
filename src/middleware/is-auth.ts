import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { Err, Req } from '../util/interfaces'

export default (req: Req, res: Response, next: NextFunction) => {
	if (!req.get('Authorization')) {
		const error: Err = new Error('Token not found!')
		error.status = 401
		throw error
	}
	const hashedToken: string = req.get('Authorization')!.split(' ')[1]

	const token = verify(hashedToken, process.env.JWT_TOKEN as string) as {
		email: string
		userId: string
	}
	if (!token) {
		throw new Error('Not authenticated')
	}
	req.userId = +token.userId
	next()
}
