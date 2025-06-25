import express from 'express'
import { getBalance, topUp } from 'controllers/WalletController'
import { protect } from 'middlewares/authMiddleware' // Import the middleware

const router = express.Router()

// Apply the protect middleware to all wallet routes
router.use(protect)

router.get('/balance', getBalance)
router.post('/topup', topUp)

export default router
