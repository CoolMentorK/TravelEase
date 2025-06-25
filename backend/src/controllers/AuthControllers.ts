import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'Email already in use' })

    const user = await User.create({ email, password })
    const token = generateToken(user._id.toString())

    res.status(201).json({
      user: { id: user._id, email: user.email, walletBalance: user.walletBalance },
      token,
    })
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: { id: user._id, email: user.email, walletBalance: user.walletBalance },
      token,
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  // @ts-ignore (for now, unless you define a custom user type)
  const user = await User.findById(req.user.id).select('-password')
  if (!user) return res.status(404).json({ error: 'User not found' })

  res.json(user)
}
