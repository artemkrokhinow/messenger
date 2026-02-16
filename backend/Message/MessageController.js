import MessageService from './MessageService.js'
const MessageController = {
    async createMessage(req, res){
        try{
            const senderId = req.user.id 
            const {receiverId, text} = req.body
            const newMessage = await MessageService.create(senderId, receiverId , text)
            res.status(201).json(newMessage)

        } catch(e){
            res.status(500).json ({message: "fail on server "})
        }
    },
    async getConversation(req, res){
        try {

            const currentId = req.user.id 
            const otherId = req.params.otherUserId
            const conversation = await MessageService.getConversation(currentId, otherId)
            return res.json(conversation)
        } catch(e) {
            res.status(500).json({message: "controll getConversation error"})
        }
    }, 
    async messageRead(req, res){
    try {
        const messageId = req.params.messageId
        const updatedMessage = await MessageService.messageRead(messageId)
        return res.json(updatedMessage)  
    }catch(e){
        res.status(500).json({message: "controll messageRead error"})
    }
},
async deleteMessage(req, res){
    try {
        const messageId = req.params.messageId
        return res.json( await MessageService.deleteMessage(messageId))  
    }catch(e){
        res.status(500).json({message: "controll deleteMessage error"})
    }
}   
   }

  
   export default MessageController 