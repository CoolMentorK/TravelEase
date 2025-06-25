import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface JwtPayload {
  id: string
}

interface AuthRequest extends Request {
  user?: JwtPayload
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  if (!process.env.JWT_SECRET) {
    console.error('Authentication error: JWT_SECRET not found')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    next()
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Invalid token')
    console.error('Authentication error:', error.message)
    res.status(401).json({ error: 'Invalid token' })
  }
}
