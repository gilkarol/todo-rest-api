import { NextFunction, Response } from 'express'

import { Err } from '../util/interfaces'
import Todo from '../models/todo'
import User from '../models/user'
import { Req } from '../util/interfaces'

export const getAllTodos = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const page: number = +req.query.page! || 1
	const todosPerPage: number = +req.body.todosPerPage || 5
	try {
		const countTodos = await Todo.countDocuments()
		const todos = await Todo.find()
			.skip((page - 1) * todosPerPage)
			.limit(todosPerPage)
		res.status(200).json({
			message: 'Todos have been found successfully!',
			todos: todos,
			numberOfTodos: countTodos,
			hasPreviousPage: page > 1,
			hasNextPage: countTodos > page * todosPerPage,
		})
	} catch (err) {
		next(err)
	}
}

export const getUserTodos = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId = +req.userId!
	const page: number = +req.query.page! || 1
	const todosPerPage: number = +req.body.todosPerPage || 5
	try {
		const countTodos = await Todo.countDocuments({ creatorId: userId })
		const todos = await Todo.find({ creatorId: userId })
			.skip((page - 1) * todosPerPage)
			.limit(todosPerPage)
		res.status(200).json({
			message: `User's todos have been found successfully!`,
			todos: todos,
			numberOfTodos: countTodos,
			hasPreviousPage: page > 1,
			hasNextPage: countTodos > page * todosPerPage,
		})
	} catch (err) {
		next(err)
	}
}

export const postTodo = async (req: Req, res: Response, next: NextFunction) => {
	const userId: number = +req.userId!
	const todoText: string = req.body.text
	const newTodo = new Todo({
		text: todoText,
		creatorId: req.userId,
	})
	try {
		const todo = await newTodo.save()
		const user = await User.findById(userId)
		user.todos.push(todo)
		await user.save()
		res.status(201).json({
			message: 'Todo has been created successfully!',
			todo: todo,
		})
	} catch (err) {
		next(err)
	}
}

export const deleteTodo = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const userId: number = +req.userId!
	const todoId: string = req.params.todoId
	try {
		const todo = await Todo.findById(todoId)
		const creatorId = todo.creatorId
		if (creatorId.toString() !== userId.toString()) {
			const error: Err = new Error(
				'This user is not the creator of todo!'
			)
			error.status = 422
			throw error
		}
		await Todo.findByIdAndRemove(todoId)
		const user = await User.findById(userId)
		user.todos.pull(todo)
		await user.save()
		res.status(200).json({ message: 'Todo has been deleted successfully!' })
	} catch (err) {
		next(err)
	}
}

export const patchTodo = async (
	req: Req,
	res: Response,
	next: NextFunction
) => {
	const todoId: string = req.params.todoId
	const userId: number = +req.userId!
	const todoText: string = req.body.text

	try {
		const todo = await Todo.findById(todoId)
		const creatorId: string = todo.creatorId
		if (creatorId.toString() !== userId.toString()) {
			const error: Err = new Error(
				'This user is not the creator of todo!'
			)
			error.status = 422
			throw error
		}
		await Todo.findOneAndUpdate(
			{ _id: todoId },
			{
				text: todoText,
			}
		)
		res.status(200).json({
			message: 'Todo has been updated successfully!',
		})
	} catch (err) {
		next(err)
	}
}
