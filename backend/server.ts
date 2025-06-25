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

// Basic itinerary routes (simplified for now)
app.get('/api/itineraries', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'Sample Itinerary',
        items: [
          {
            id: '1',
            title: 'Sigiriya Rock Fortress',
            location: 'Sigiriya, Central Province',
            time: '08:00 AM',
            duration: '3 hours',
            category: 'Attraction',
            price: 'LKR 5,000',
          }
        ]
      }
    ]
  })
})

app.post('/api/itineraries', (req: Request, res: Response) => {
  const { title, items } = req.body
  res.status(201).json({
    success: true,
    data: {
      id: Date.now().toString(),
      title,
      items: items || [],
    }
  })
})

// Port fallback and server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
