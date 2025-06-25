import type { Request, Response } from 'express'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './src/config/db' // Adjusted path
import logger from './src/config/logger' // Import logger
import routes from './src/routes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('TravelEase backend up!')
})

// Basic itinerary routes (mock data)
app.get('/api/itineraries', (_req: Request, res: Response) => {
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
          },
        ],
      },
    ],
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
    },
  })
})

const startServer = async (): Promise<void> => {
  try {
    await connectDB() // Wait for DB connection
    app.use('/api', routes)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    throw error
  }
}

// Handle the startServer promise
startServer().catch(error => {
  logger.error('Application failed to start:', error)
  process.exit(1)
})
