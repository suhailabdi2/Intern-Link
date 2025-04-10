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
    const { internshipId, companyId } = req.body
    const userId = req.auth.userId
    
    if (!internshipId) {
        return res.json({
            success: false,
            message: "Internship ID is required"
        });
    }
    
    try {
        console.log("Checking for existing application with userId:", userId, "internshipId:", internshipId);
        
        // Use proper MongoDB query format
        const isAlreadyApplied = await internshipApplication.find({
            internshipId: internshipId,
            userId: userId
        });

        console.log("Already applied check result:", isAlreadyApplied);

        if (isAlreadyApplied && isAlreadyApplied.length > 0) {
            return res.json({
                success: false,
                message: "You have already applied for this internship"
            });
        }

        // Find the internship data
        const internshipData = await internship.findById(internshipId);

        if(!internshipData){
            return res.json({
                success: false, 
                message: 'Internship not found'
            });
        }

        // Ensure we're using the right companyId format
        const companyIdToUse = internshipData.companyId;
        console.log("Using companyId:", companyIdToUse);

        try {
            // Create the application with careful error handling
            const newApplication = await internshipApplication.create({
                companyId: companyIdToUse,
                userId,
                internshipId,
                date: Date.now()
            });

            console.log("New application created:", newApplication);

            return res.json({
                success: true, 
                message: "Applied successfully",
                application: newApplication
            });
        } catch (dbError) {
            console.error("Database creation error:", dbError);
            return res.json({
                success: false, 
                message: "Error saving application to database. " + dbError.message
            });
        }
    } catch (error) {
        console.error("Application error:", error);
        return res.json({
            success: false, 
            message: error.message || "An error occurred while applying"
        });
    }
}
export const getUserInternshipApplications = async (req,res) =>{
    try{
        const userId = req.auth.userId

        const applications = await internshipApplication.find({userId})
            .populate('companyId', 'name email image')
            .populate('internshipId', 'title description location year category')
            .exec();

        if(!applications || applications.length === 0){
            return res.json({success:false, message:"No internship applications found"})
        }
        return res.json({
            success: true, 
            applications: applications
        })
    }catch(error){
        console.error("Error fetching applications:", error);
        return res.json({success:false, message:error.message})
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