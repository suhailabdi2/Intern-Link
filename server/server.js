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

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Remove integrations for now to fix the error
  tracesSampleRate: 1.0,
});

// Connect to database and cloudinary
await connectDB()
await connectCloudinary()

// Middleware
app.use(cors())
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }))
app.use(clerkMiddleware())

// Routes
app.get('/', (req, res) => res.send("API working"))

// Clerk webhook route - must be before other routes
app.post("/webhooks", express.raw({ type: 'application/json' }), clerkWebhook)

// API routes
app.use('/api/company', companyRoutes)
app.use('/api/internships', internshipRoutes)
app.use('/api/users', userRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  Sentry.captureException(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


