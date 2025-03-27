import express from 'express'
import { applyforInternship, getUserData, getUserInternshipApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'

const router = express.Router()

router.get('/user',getUserData)
router.post('/apply',applyforInternship)
router.get('/applications',getUserInternshipApplications)
router.post('/update-resume',upload.single('resume'),updateUserResume)
export default router