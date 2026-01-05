
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
    }
   }

   export default ProfileController 