import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    throw new Error('MONGO_URI not found')
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ MongoDB connected')
  } catch (err) {
    const error = err instanceof Error ? err : new Error('DB connection failed')
    console.error('❌ DB connection failed:', error.message)
    throw error // Re-throw the error instead of process.exit
  }
}
