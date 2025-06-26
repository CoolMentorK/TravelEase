import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessType: { type: String },
    location: { type: String },
    isApproved: { type: Boolean, default: false }, // Optional admin review step
  },
  { timestamps: true },
)

vendorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

vendorSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

export default mongoose.model('Vendor', vendorSchema)
