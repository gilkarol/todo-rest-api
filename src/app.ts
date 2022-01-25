import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { json } from 'body-parser'
import dotenv from 'dotenv'

import todoRoutes from './routes/todo'
import authRoutes from './routes/auth'

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

app.use((error: any, req: any, res: any, next: any) => {
	const status = error.status || 500
	const message = error.message
	const data = error.data
	res.status(status).json({ message: message, data: data })
})

mongoose
	.connect(process.env.DATABASE_LINK as string)
	.then((result) => {
		app.listen(process.env.PORT as string)
	})
	.catch((err) => {
		console.log(err)
	})
