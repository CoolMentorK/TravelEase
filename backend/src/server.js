import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config() // Loads .env before anything else

// Middleware setup
const app = express()
app.use(express.json())
app.use(cors())

// MongoDB connection using env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Health check route
app.get('/', (req, res) => res.send('TravelEase backend up!'))

// Dynamic port from env
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
