import internshipApplication from "../models/internshipApplication.js"
import internship from "../models/Internship.js"
import User from "../models/user.js"
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from 'bcrypt'
import generateToken from '../utils/generateToken.js'

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
        const userData = req.user
        const resumeFile = req.file

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path, {
                resource_type: "raw",
                format: "pdf"
            })
            userData.resume = resumeUpload.secure_url
            await userData.save()

            return res.json({
                success: true,
                message: "Resume updated successfully",
                resumeUrl: resumeUpload.secure_url
            })
        } else {
            return res.json({
                success: false,
                message: "No resume file provided"
            })
        }

    }catch(error){
        console.error("Resume update error:", error)
        return res.json({
            success: false,
            message: error.message || "Error updating resume"
        })
    }
}

// Register new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        return res.json({ success: false, message: "Missing Details" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            image: imageUpload.secure_url,
            resume: ''
        });

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};