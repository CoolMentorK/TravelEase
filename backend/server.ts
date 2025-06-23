import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import { Request, Response } from 'express'

dotenv.config() // Load .env before anything else

const app = express()
app.use(express.json())
app.use(cors())

// Validate environment variable before use
const mongoUri = process.env.MONGO_URI
if (!mongoUri) {
  throw new Error('❌ MONGO_URI is not defined in environment variables')
}

// Connect to MongoDB using validated URI
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('TravelEase backend up!')
})
// Port fallback and server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
