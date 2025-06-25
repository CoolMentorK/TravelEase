// src/controllers/WalletController.ts
import { Response } from 'express'
import * as WalletService from '../services/wallet.service'
import { AuthRequest } from '../middlewares/authMiddleware' // Import the custom request type

export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    // We can now safely access req.user because:
    // 1. The protect middleware ensures it exists
    // 2. The AuthRequest type includes the user property
    const wallet = await WalletService.getUserWallet(req.user.id)
    res.json({ balance: wallet.balanceLKR })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch balance' })
  }
}

export const topUp = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const wallet = await WalletService.topUpUserWallet(req.user.id, amount)
    res.json({ balance: wallet.balanceLKR })
  } catch (err) {
    res.status(500).json({ error: 'Top-up failed' })
  }
}
