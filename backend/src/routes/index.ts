import express from 'express'
import authRoutes from './auth'

const router = express.Router()

router.use('/auth', authRoutes)

router.get('/', (_req, res) => {
  res.send('📍 API Root')
})

export default router
