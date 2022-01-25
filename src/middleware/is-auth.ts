import { verify } from 'jsonwebtoken'

export default (req: any, res: any, next: any) => {
	const hashedToken: string = req.get('Authorization').split(' ')[1]

	const token = verify(hashedToken, 'secrettoken') as {
		email: string
		userId: string
	}
	if (!token) {
		throw new Error('Not authenticated')
	}
	req.userId = token.userId.toString()
	next()
}
