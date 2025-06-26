import type { InferSchemaType, HydratedDocument, Model } from 'mongoose'
import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

// Define instance methods
interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>
}

// Define schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true },
)

// Infer types from schema
type UserSchemaType = InferSchemaType<typeof userSchema>
type UserDocument = HydratedDocument<UserSchemaType, IUserMethods>
type UserModel = Model<UserSchemaType, Record<string, never>, IUserMethods>

// Method: compare password
userSchema.methods.comparePassword = async function comparePassword(
  this: UserDocument,
  candidate: string,
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password)
}

// Pre-save hook to hash password
userSchema.pre('save', async function preSave(this: UserDocument, next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  return next()
})

const User = model<UserSchemaType, UserModel>('User', userSchema)

export default User
export type { UserSchemaType as IUser }
