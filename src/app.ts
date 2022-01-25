import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { json } from 'body-parser'
import dotenv from 'dotenv'

import todoRoutes from './routes/todo'
import authRoutes from './routes/auth'
import handleError from './models/error'

dotenv.config({ path: './.env' })

const app = express()

app.use(
	cors({
		origin: '*',
		methods: '*',
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
)

app.use(json())
app.use('/auth', authRoutes)
app.use('/todo', todoRoutes)

app.use((error: handleError, req: any, res: any, next: any) => {
	const statusCode = error.status || 500
	const message = error.message
	res.status(statusCode).json({ message: message })
})

mongoose
	.connect(process.env.DATABASE_LINK as string)
	.then((result) => {
		app.listen(process.env.PORT as string)
	})
	.catch((err) => {
		console.log(err)
	})
