import express from 'express'
import { getBalance, topUp, payVendor, getTransactionHistory } from 'controllers/WalletController'
import { protect } from 'middlewares/authMiddleware'

const router = express.Router()

// Apply protect middleware globally to all wallet routes
router.use(protect)

router.get('/balance', getBalance)
router.post('/topup', topUp)
router.post('/pay', payVendor)
router.get('/transactions', getTransactionHistory)

export default router
