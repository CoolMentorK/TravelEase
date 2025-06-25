import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['TOPUP', 'PAYMENT'], required: true },
    amountLKR: { type: Number, required: true },
    vendorId: { type: String }, // Optional
    timestamp: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model('Transaction', TransactionSchema);
