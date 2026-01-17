import getContacts from '../auth/RegistrController.js'
import ProfileService from './ProfileService.js'

const ProfileController = {
    async getProfile(req, res){
        try {
            const user = req.params.selectedEmail
            const profile = await ProfileService.getProfile(user)
            console.log(profile)
            return res.json(profile)
        } catch(e) {
            res.status(500).json({message: "controll getProfile error"})
        }
    },
async uploadAvatar(req, res){
    try {
        const userEmail = req.params.selectedEmail
        const {file} = req.file
        await ProfileService.uploadAvatar(userEmail, file )
        return res.json({ message: "Avatar uploaded successfully" })
    }
    catch (e) {
        res.status(500).json({ message: "controll uploadAvatar error" })
    }
}
}
   export default ProfileController 