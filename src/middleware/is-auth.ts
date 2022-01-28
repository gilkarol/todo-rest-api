import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'

export default (req: any, res: Response, next: NextFunction) => {
	const hashedToken: string = req.get('Authorization').split(' ')[1]

	const token = verify(hashedToken, process.env.JWT_TOKEN as string) as {
		email: string
		userId: string
	}
	if (!token) {
		throw new Error('Not authenticated')
	}
	req.userId = token.userId.toString()
	next()
}
