import mongoose from 'mongoose'

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balanceLKR: { type: Number, default: 0 },
})

export const Wallet = mongoose.model('Wallet', WalletSchema)
