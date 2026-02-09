import ProfileService from './ProfileService.js'

const ProfileController = {
    async getProfile(req, res){
        try {
            const user = req.params.selectedEmail
            const profile = await ProfileService.getProfile(user)
            return res.json(profile)
        } catch(e) {
            res.status(500).json({message: "controll getProfile error"})
        }
    },
async uploadAvatar(req, res){
    try {
        const userEmail = req.params.selectedEmail
        const myEmail = req.user.email
        if(userEmail !== myEmail){
            return res.status(403).json({message: "Forbidden"})
        }
        const {avatar} = req.body
        if(!avatar){
            return res.status(400).json({message: "No file uploaded"})
        }
        await ProfileService.uploadAvatar(userEmail, avatar )
        return res.json({ message: "Avatar uploaded successfully" })
    }
    catch (e) {
        res.status(500).json({ message: "controll uploadAvatar error" })
    }
}
}
   export default ProfileController 