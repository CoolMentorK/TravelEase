import express from 'express'
import authRoutes from './auth'
import walletRoutes from './wallet' // import wallet routes

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/wallet', walletRoutes) // mount wallet routes at /wallet

router.get('/', (_req, res) => {
  res.send('📍 API Root')
})

export default router
