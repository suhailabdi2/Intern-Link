import express from 'express'
import { ChangeInternshipApplicationStatus, ChangeVisibility, getCompanyApplicants, getCompanyData, getCompanyPostedInternships, loginCompany, postInternship, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectComapny } from '../middleware/autMiddleware.js'

const router = express.Router()
//Register a company

router.post('/register', upload.single("image"), registerCompany)
//Company Login
router.post ('/login', loginCompany)

//Get company data
router.get('/company',protectComapny ,getCompanyData)

//post an internship
router.post('/post-internship', protectComapny,postInternship)

//GetApplicants
router.get('/applicants',protectComapny,getCompanyApplicants)
//get company internship list
router.get('/list-internship', protectComapny ,getCompanyPostedInternships)
//change applicants status
router.post('/change-status', protectComapny, ChangeInternshipApplicationStatus)
//chaneg app visibility
router.post('/change-visibility', protectComapny, ChangeVisibility)

export default router