import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from'./config/db.js'
import * as Sentry from "@sentry/node"
import { clerkWebhook } from './controllers/webhooks.js'
import companyRoutes from './routes/companyroutes.js'
import connectCloudinary from './config/cloudinary.js'
import internshipRoutes from './routes/internshipRoutes.js'
import userRoutes from './routes/userRoutes.js'
import { clerkMiddleware } from '@clerk/express'
const app = express()

//database
await connectDB()
await connectCloudinary()
// middleware
app.use(cors())
app.use(clerkMiddleware())
app.use(express.json())
//Routes
app.get('/', (req,res) =>  res.send("API working"))
const PORT = process.env.PORT || 5000
Sentry.setupExpressErrorHandler(app)
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
app.post ("/webhooks",clerkWebhook)
app.use('/api/company',companyRoutes)
app.use('/api/internships',internshipRoutes)
app.use('/api/users',userRoutes)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


