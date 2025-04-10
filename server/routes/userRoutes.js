import express from 'express'
import { applyforInternship, getUserData, getUserInternshipApplications, updateUserResume, registerUser, loginUser } from '../controllers/userController.js'
import upload from '../config/multer.js'
import { protectUser } from '../middleware/autMiddleware.js'

const router = express.Router()

// Auth routes
router.post('/register', upload.single('image'), registerUser)
router.post('/login', loginUser)

// Protected routes
router.get('/user', protectUser, getUserData)
router.get('/applications', protectUser, getUserInternshipApplications)
router.post('/apply', protectUser, applyforInternship)
router.post('/update-resume', protectUser, upload.single('resume'), updateUserResume)

export default router