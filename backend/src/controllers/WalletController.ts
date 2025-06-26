import type { Request, Response, NextFunction } from 'express'
import type { AuthRequest } from 'middlewares/authMiddleware'
import * as WalletService from '../services/wallet.service'

// GET /wallet/balance
export const getBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authReq = req as AuthRequest

  try {
    const wallet = await WalletService.getUserWallet(authReq.user!.id)
    res.json({ balance: wallet.balanceLKR })
  } catch (error) {
    next(error)
  }
}

// POST /wallet/top-up
export const topUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authReq = req as AuthRequest

  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' })
      return
    }

    const wallet = await WalletService.topUpUserWallet(authReq.user!.id, amount)
    res.json({ balance: wallet.balanceLKR })
  } catch (error) {
    next(error)
  }
}

// POST /wallet/pay
export const payVendor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authReq = req as AuthRequest

  try {
    const { vendorId, amount } = req.body

    if (!vendorId || !amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid payment request' })
      return
    }

    await WalletService.deductFromWallet(authReq.user!.id, amount, vendorId)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

// GET /wallet/transactions
export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authReq = req as AuthRequest

  try {
    const transactions = await WalletService.getUserTransactions(authReq.user!.id)
    res.json({ transactions })
  } catch (error) {
    next(error)
  }
}
