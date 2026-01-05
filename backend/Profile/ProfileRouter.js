import ProfileController from "./ProfileController.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'

const routerProfile = new Router()
routerProfile.get('/profile/:selectedEmail', authMiddleware, ProfileController.getProfile)

export default routerProfile