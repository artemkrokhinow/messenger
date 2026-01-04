import RegistrController from './RegistrController.js'
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'
const rrouter = new Router()

rrouter.post('/registration', RegistrController.registration)
rrouter.post('/login', RegistrController.login)
rrouter.get('/users', authMiddleware, RegistrController.getUsers)
rrouter.get('/contacts', authMiddleware, RegistrController.getContacts)

export default rrouter