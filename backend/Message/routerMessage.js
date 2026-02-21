import MessageController from "./MessageController.js"
import {Router} from'express'
import authMiddleware  from '../middleware/authMiddleware.js'

const routerMessage = new Router()

routerMessage.get('/chat', authMiddleware, MessageController.getLastMessages)
routerMessage.get('/chat/:otherUserId', authMiddleware, MessageController.getConversation)
routerMessage.post('/chat/:messageId', authMiddleware, MessageController.messageRead)
routerMessage.post('/chat', authMiddleware, MessageController.createMessage)
routerMessage.delete('/chat/:messageId', authMiddleware, MessageController.deleteMessage)


export default routerMessage