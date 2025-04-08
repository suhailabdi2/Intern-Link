import internshipApplication from "../models/internshipApplication.js"
import internship from "../models/Internship.js"
import User from "../models/user.js"
import {v2 as cloudinary} from 'cloudinary'


//get user data
export const getUserData = async (req,res) =>{
    const userId = req.auth.userId
    try {
        const user = await User.findById(userId)
        if(!user){
            return res.json({success:false,message:"USer not found"})
        }
        return res.json({success:true,user})
    } catch (error) {
        return res.json({success:false,message:error})
        
    }
}
export const applyforInternship = async(req,res)=>{
    const { internshipId } = req.body
    const userId = req.auth.userId
    try {
        const isAlreadyApplied = await internshipApplication.find(internshipId,userId)

        if (isAlreadyApplied.length > 0) {
            res.json({
                success:false,message:"Already applied"
            })
        }

        const internshipData = await internship.findById(internshipId)

        if(!internshipData){
            return res.json({success:false, message :'Internship not found'})
        }

        await internshipApplication.create({
            companyId: internshipData.companyId,
            userId,
            internshipId,
            date: Date.now()
        })

        res.json({success:true, message:"Applied succesfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}
export const getUserInternshipApplications = async (req,res) =>{
    try{
        const userId = req.auth.userId

        const application = await internshipApplication.find({userId}).populate('companyId,name email image').populate('internshipID,title description location year category').exec()

        if(!application){
            return res.json({success:false, message:"No internship applications found"})
        }
        return res.json({success:false, message :application})
    }catch(error){
        return res.json({success:false, message:error})
    }
}
export const updateUserResume = async (req,res) =>{
    try{
        const userId = req.auth.userId
        const resumeFile = req.resumeFile
        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()

        return res.json({
            success:true, message:"REsume updated"
        })

    }catch(error){
        res.json({
            message:false, 
        })

    }
}