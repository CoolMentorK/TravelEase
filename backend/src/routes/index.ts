import express from 'express'
import vendorRoutes from 'routes/VendorRoutes'
import vendorDashboardRoutes from 'routes/vendorDashboardRoutes'
import authRoutes from './auth'
import walletRoutes from './wallet' // import wallet routes

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/wallet', walletRoutes) // mount wallet routes at /wallet
router.use('/vendor', vendorRoutes)
router.use('/vendor', vendorDashboardRoutes) // mount vendor dashboard routes
router.get('/', (_req, res) => {
  res.send('📍 API Root')
})

export default router
