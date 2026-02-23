import ProfileService from './ProfileService.js'

const ProfileController = {
    async getProfile(req, res){
        try {
            const user = req.params.userId
            const profile = await ProfileService.getProfile(user)
            return res.json(profile)
        } catch(e) {
            res.status(500).json({message: "controll getProfile error"})
        }
    },
async uploadAvatar(req, res){
    try {
        const userId = req.params.userId
        const {file} = req.body
        if(!file){
            return res.status(400).json({message: "No file uploaded"})
        }
        if(!userId){
            return res.status(400).json({message: "No user selected"})
        }
        const updatedAvatar = await ProfileService.uploadAvatar(file, userId )
        return res.json(updatedAvatar)
    }
    catch (e) {
        res.status(500).json({ message: "controll uploadAvatar error", error: e.message })
    }
}
}
   export default ProfileController 