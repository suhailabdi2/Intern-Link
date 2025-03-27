import express from "express"
import { getInternshipById, getInternships } from "../controllers/internshipControllers.js"

const router = express.Router()

//Roue to get all internshsip data
router.get('/',getInternships)
// Route to get a single internship by id
router.get('/:id', getInternshipById)

export default router