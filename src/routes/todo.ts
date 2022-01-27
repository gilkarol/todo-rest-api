import { Router } from 'express'

import { getAllTodos, postTodo, deleteTodo, patchTodo, getUserTodos } from '../controllers/todoController'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/', isAuth, getAllTodos)

router.get('/user', isAuth, getUserTodos)

router.post('/', isAuth, postTodo)

router.delete('/:todoId', isAuth, deleteTodo)

router.patch('/:todoId', isAuth, patchTodo)

export default router
