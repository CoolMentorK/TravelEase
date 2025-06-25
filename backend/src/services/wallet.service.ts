import { Wallet } from '../models/Wallet'

export const getUserWallet = async (userId: string) => {
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = await Wallet.create({ userId, balanceLKR: 0 })
  }
  return wallet
}

export const topUpUserWallet = async (userId: string, usdAmount: number) => {
  const exchangeRate = 300 // mock rate: 1 USD = 300 LKR
  const lkrAmount = usdAmount * exchangeRate

  const wallet = await getUserWallet(userId)
  wallet.balanceLKR += lkrAmount
  await wallet.save()
  return wallet
}
