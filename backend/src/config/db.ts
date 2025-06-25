import mongoose from 'mongoose'
import logger from './logger' // Import the winston logger

export const connectDB = async (): Promise<void> => {
  const uri: string | undefined = process.env.MONGO_URI
  if (!uri) {
    const error = new Error('MONGO_URI environment variable is not defined')
    logger.error(error.message)
    throw error
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if server not found
      retryWrites: true, // Enable retryable writes
    })
    logger.info('Successfully connected to MongoDB')
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Database connection failed')
    logger.error('Database connection failed:', error.message)
    throw error
  }
}
