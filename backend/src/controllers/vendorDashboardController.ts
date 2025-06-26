import type { Request, Response } from 'express'

interface AuthRequest extends Request {
  vendor?: any
}

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    // For now, mock data (replace with DB queries later)

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
    res.status(500).json({ message: 'Failed to fetch dashboard data' })
  }
}
