import type { Document } from 'mongoose'
import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

// Define the User interface
interface IUser extends Document {
  _id: string
  email: string
  password: string
  walletBalance: number
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Hash password before saving
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  return next()
})

// Define comparePassword method
userSchema.methods.comparePassword = async function comparePassword(
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

// Create and export the User model
const User = model<IUser>('User', userSchema)
export default User
