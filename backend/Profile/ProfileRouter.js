import ProfileController from "./ProfileController.js"
import ProfileService from "./ProfileService.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'
import MongoProfile from '../models/ProfileModels.js'

const routerProfile = new Router()

routerProfile.post('/profile', authMiddleware, ProfileController.create)
routerProfile.get('/profile/:selectedEmail', authMiddleware, ProfileController.getProfile)

export default routerProfile