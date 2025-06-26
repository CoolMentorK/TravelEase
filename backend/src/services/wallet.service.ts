import { Wallet } from 'src/models/Wallet'
import { Transaction } from 'src/models/Transaction'

export const getUserWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = await Wallet.create({ userId, balanceLKR: 0 })
  }
  return wallet
}

export const recordTransaction = async (
  userId: string,
  type: 'TOPUP' | 'PAYMENT',
  amountLKR: number,
  vendorId?: string,
) => {
  await Transaction.create({ userId, type, amountLKR, vendorId })
}

export const topUpUserWallet = async (userId: string, usdAmount: number) => {
  const exchangeRate = 300 // mock rate: 1 USD = 300 LKR
  const lkrAmount = usdAmount * exchangeRate

  const wallet = await getUserWallet(userId)
  wallet.balanceLKR += lkrAmount
  await wallet.save()

  // Record the top-up transaction
  await recordTransaction(userId, 'TOPUP', lkrAmount)

  return wallet
}

export const deductFromWallet = async (userId: string, lkrAmount: number, vendorId: string) => {
  const wallet = await getUserWallet(userId)
  if (wallet.balanceLKR < lkrAmount) {
    throw new Error('Insufficient balance')
  }

  wallet.balanceLKR -= lkrAmount
  await wallet.save()

  // Record the payment transaction
  await recordTransaction(userId, 'PAYMENT', lkrAmount, vendorId)

  return wallet
}

export const getUserTransactions = async (userId: string) => {
  return Transaction.find({ userId }).sort({ timestamp: -1 })
}
