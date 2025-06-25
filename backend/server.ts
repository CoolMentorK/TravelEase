import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from 'config/db' // Adjusted path
import logger from 'config/logger' // Import logger
import routes from './src/routes'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const startServer = async (): Promise<void> => {
  try {
    await connectDB() // Wait for DB connection
    app.use('/api', routes)

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    throw error // Throw error instead of process.exit
  }
}

// Handle the startServer promise
startServer().catch(error => {
  logger.error('Application failed to start:', error)
  // eslint-disable-next-line no-process-exit
  process.exit(1) // Exit at the top level
})
