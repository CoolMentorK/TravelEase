import type { Response, NextFunction } from 'express'
import type { AuthRequest } from 'middlewares/authMiddleware'
import * as WalletService from '../services/wallet.service'

export const getBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const wallet = await WalletService.getUserWallet(req.user!.id) // Assert user exists
    res.json({ balance: wallet.balanceLKR })
  } catch (err) {
    next(err) // Pass error to Express error handler
  }
}

export const topUp = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' })
      return
    }

    const wallet = await WalletService.topUpUserWallet(req.user!.id, amount)
    res.json({ balance: wallet.balanceLKR })
  } catch (err) {
    next(err)
  }
}

export const payVendor = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { vendorId, amount } = req.body

    if (!vendorId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid payment request' })
    }

    // Use the service method that handles deduction and transaction recording
    await WalletService.deductFromWallet(userId, amount, vendorId)

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const transactions = await WalletService.getUserTransactions(userId)
    res.json({ transactions })
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch transactions' })
  }
}
