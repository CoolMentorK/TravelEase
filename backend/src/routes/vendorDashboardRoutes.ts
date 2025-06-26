import express from 'express'
import { getDashboardData } from '../controllers/vendorDashboardController'
import { protectVendor } from '../middlewares/protectVendor'

const router = express.Router()

router.get('/dashboard', protectVendor, getDashboardData)

export default router
