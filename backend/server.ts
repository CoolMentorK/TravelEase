import type { Request, Response, ErrorRequestHandler } from 'express'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { connectDB } from './src/config/db'
import logger from './src/config/logger'
import routes from './src/routes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/api', routes)

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.send('TravelEase backend up!')
})

// Mock route example (ok to keep or remove later)
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

// Add itinerary POST mock
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

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
}

app.use(errorHandler)

// ✅ Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    throw error
  }
}

startServer().catch(error => {
  logger.error('Application failed to start:', error)
  throw error
})
