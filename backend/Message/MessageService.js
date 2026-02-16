import Message from '../models/messageModels.js'



const MessageService = {
    async create(senderId, receiverId, text){
        const message = await Message.create({
            senderId : senderId,
            receiverId : receiverId,
            text: text 
        })
        
        return message
    },
    async getConversation(user1_ID, user2_ID ){
        const chatMessage = await Message.find({
              $or: [
                    {senderId:  user1_ID , receiverId : user2_ID },
                    {senderId:  user2_ID , receiverId : user1_ID }
                ]
        }).sort({ createdAt: 1 })

        return chatMessage
    },
    async messageRead(messageId){
        if(!messageId)return 
        const updatedMessage = await Message.findByIdAndUpdate(
             messageId,
            {read: true},
            {new: true}
        )
        if(!updatedMessage)return
        return updatedMessage
    },
    async deleteMessage(messageId){
        const deleteMessage = await Message.findByIdAndDelete(messageId)
        return(deleteMessage)
    }   
}

export default MessageService  