import express from 'express'
import { registerVendor, loginVendor } from 'controllers/VendorController'

const router = express.Router()

router.post('/register', registerVendor)
router.post('/login', loginVendor)

export default router
