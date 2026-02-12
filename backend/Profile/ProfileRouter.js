import ProfileController from "./ProfileController.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'

const routerProfile = new Router()
routerProfile.get('/profile/:userId', authMiddleware, ProfileController.getProfile)
routerProfile.post('/profile/:userId', authMiddleware, ProfileController.uploadAvatar)
export default routerProfile