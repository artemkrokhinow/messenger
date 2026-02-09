import MessageController from "./MessageController.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'

const routerMessage = new Router()

routerMessage.post('/chat', authMiddleware, MessageController.createMessage)
routerMessage.get('/chat/:otherUserId', authMiddleware, MessageController.getConversation)
routerMessage.post('/chat/:messageId', authMiddleware, MessageController.messageRead)

export default routerMessage