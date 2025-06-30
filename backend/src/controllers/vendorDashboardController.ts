import type { Request, Response } from 'express'
import type { IVendor } from '../models/Vendor'
import logger from '../config/logger'

interface VendorAuthRequest extends Request {
  vendor?: IVendor
}

export const getDashboardData = async (req: VendorAuthRequest, res: Response): Promise<void> => {
  try {
    const { vendor } = req
    logger.info(`Vendor accessing dashboard: ${vendor?.name}`)

    const feedback = [
      { id: '1', tourist: 'Alice', rating: 4, comment: 'Great experience!' },
      { id: '2', tourist: 'Bob', rating: 5, comment: 'Highly recommend!' },
    ]

    const transactions = [
      { id: 't1', amount: 1500, date: '2025-06-20', product: 'City Tour' },
      { id: 't2', amount: 5000, date: '2025-06-22', product: 'Traditional Lunch' },
    ]

    const summary = {
      totalEarnings: transactions.reduce((acc, t) => acc + t.amount, 0),
      productsSold: transactions.length,
      feedbackCount: feedback.length,
    }

    res.json({ feedback, transactions, summary })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard data' })
  }
}
