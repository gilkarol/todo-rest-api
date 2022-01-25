import { Router } from 'express'

import { getTodos, postTodo, deleteTodo, patchTodo } from '../controllers/todoController'
import isAuth from '../middleware/is-auth'

const router = Router()

router.get('/', isAuth, getTodos)

router.post('/', isAuth, postTodo)

router.delete('/:todoId', isAuth, deleteTodo)

router.patch('/:todoId', isAuth, patchTodo)

export default router
