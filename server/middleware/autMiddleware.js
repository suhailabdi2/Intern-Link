import jwt from "jsonwebtoken"
import Company from "../models/Company.js"
import User from "../models/user.js"

export const protectComapny = async (req,res,next) => {
    const token = req.headers.token

    if (!token) {
        res.json({
            success:false,
            message:"not authorized, log in again"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.company = await Company.findById(decoded.id).select('-password')
        next()
    } catch (error) {
        res.json({success:false, message:error})
    }
    
}

export const protectUser = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.json({
            success: false,
            message: "Not authorized, please log in again"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        
        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        return res.json({
            success: false,
            message: "Invalid token"
        })
    }
}
