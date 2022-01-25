import Todo from '../models/todo'
import User from '../models/user'


export const getTodos = async (req: any, res: any, next: any) => {
	try {
		const todos = await Todo.find()
		res.status(200).json({
			message: 'Todos have been found successfully!',
			todos: todos,
		})
	} catch (err) {
		res.status(303)
		throw err
	}
}

export const postTodo = async (req: any, res: any, next: any) => {
	const userId: string = req.userId
	const todoText: string = req.body.text
	const todo = new Todo({
		text: todoText,
		creatorId: req.userId,
	})
	try {
		await todo.save()
		await User.findById(userId)
		res.status(201).json({
			message: 'Todo has been created successfully!',
			todo: todo,
		})
	} catch (err) {
		res.status = 404
		throw err
	}
}

export const deleteTodo = async (req: any, res: any, next: any) => {
	const userId: string = req.userId
	const todoId: string = req.params.todoId
	try {
		const todo = await Todo.findById(todoId)
		const creatorId = todo.creatorId
		if (creatorId.toString() !== userId.toString())
			throw new Error('This user is not the creator of todo')
		await Todo.findByIdAndRemove(todoId)
		res.status(200).json({ message: 'Todo has been deleted successfully!' })
	} catch (err) {
		throw err
	}
}

export const patchTodo = async (req: any, res: any, next: any) => {
	const todoId: string = req.params.todoId
	const userId: string = req.userId
	const todoText = req.body.text

	try {
		const todo = await Todo.findById(todoId)
		const creatorId: string = todo.creatorId
		if (creatorId.toString() !== userId.toString())
			throw new Error('This user is not the creator of todo')
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
		console.log(res.status)
		throw err
	}
}
