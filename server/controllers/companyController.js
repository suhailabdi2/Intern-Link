import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import internship from "../models/Internship.js";
import { now, trusted } from "mongoose";


// REgister new Company
export const registerCompany = async(req,res) =>{
    const {name,email,password} =req.body;
    const imageFile = req.file;
    if (!name || !email || !password || !imageFile) {
        return res.json({success:false,message :"Missing Details"})
    }
    try {
        const companyExists = await Company.findOne({email})
        if (companyExists) {
            return res.json({success:false,message :"Company already Registered"})
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        const company = await Company.create({
            name,email,password:hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success:true,
             company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image


            },
            token: generateToken(company.id)

        })
    } catch (error) {
        res.json({
            success:false,  message:error
        })
    }

} 
// handle company login 
export const loginCompany = async (req,res) => {

    const {email,password} = req.body
    try {
        const company = await Company.findOne({email})
        if (bcrypt.compare(password,company.password)) {
            res.json({
                success:true,
                company:{
                _id:company._id,
                name:company.name,
                email:company.email,
                image:company.image

                },token:generateToken(company._id)
            })
            
        }else{
            res.json({
                success:false, message:"Invalid email or password"
            })
        }
    } catch (error) {
        
    }
}

//handle company data

export const getCompanyData = async (req,res) =>{
    const company = req.company

    try {
        res.json({
            success:true,company
        })
    } catch (error) {
        res.json({
            success:false,
            message:error
        })
    }
    
    
    

    

}
//post a new job
export const postInternship = async (req,res) =>{
    const {title,location,description,category,year} = req.body
    const companyId = req.company._id
    try {
        const newInternship = new internship({
            title,
            location,
            description,
            companyId,
            date:Date.now(),
            category,
            year,
            
            
        })
        await newInternship.save()
        res.json({success:true, newInternship})
    } catch (error) {
        res.json({
            success:false, message:error
        })
    }

    

}
 // get company job applicants
 export const getCompanyApplicants = async (req,res) => {
    
 }
 // get company posted internships
 export const getCompanyPostedInternships = async (req,res)=>{
    try {
        const companyId = req.company._id
        const internships = await internship.findById(companyId)
//ToDo add number of applicants
        res.json({
            success:true,
            internshipsData:internships
        })
    } catch (error) {
        res.json({
            success:false,
            message:error
        })
    }
 }
//change internship application status
export const ChangeInternshipApplicationStatus = async (req,res)=>{

}
export const ChangeVisibility = async (req,res) =>{
    try {
        const {id} = req.body
        const companyId = req.company._id
        const internship = await internship.findById(id)
        if (companyId.toString() === internship.companyId.toString()) {
            internship.visible = !internship.visible
            
        }
        await internship.save()
        res.json({success:true,internships})
    } catch (error) {
        res.json({success:false,message:error
        })
    }
}
