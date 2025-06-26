import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'

// Authenticated request interface
interface AuthRequest extends Request {
  user?: { id: string }
}

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

// Register user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user._id.toString())

    res.status(201).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// Login user
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).json({ error: 'Invalid credentials' })
      return
    }

    const token = generateToken(user._id.toString())

    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
      },
      token,
    })
  } catch (err) {
    next(err)
  }
}

// Get user profile
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password')
    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      walletBalance: user.walletBalance,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (err) {
    next(err)
  }
}
