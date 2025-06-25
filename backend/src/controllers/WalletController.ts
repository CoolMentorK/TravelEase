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
