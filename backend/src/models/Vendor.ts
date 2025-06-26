import type { Document, Model } from 'mongoose'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export interface IVendor extends Document {
  name: string
  email: string
  password: string
  businessType?: string
  location?: string
  isApproved: boolean
  comparePassword(candidatePassword: string): Promise<boolean>
}

const vendorSchema = new mongoose.Schema<IVendor>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessType: { type: String },
    location: { type: String },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Use named, properly returning async functions for pre-hooks
vendorSchema.pre<IVendor>('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    return next(err as Error)
  }
})

// Method with no redundant `await` and proper `this` typing
vendorSchema.methods.comparePassword = function comparePassword(
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

const Vendor: Model<IVendor> = mongoose.model<IVendor>('Vendor', vendorSchema)
export default Vendor
