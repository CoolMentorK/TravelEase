import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import logger from '../config/logger' // Import winston logger

interface JwtPayload {
  id: string
}

// Export AuthRequest interface
export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  if (!process.env.JWT_SECRET) {
    logger.error('Authentication error: JWT_SECRET not found')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    next()
  } catch (err) {
    logger.error('Authentication error:', err instanceof Error ? err.message : 'Invalid token')
    res.status(401).json({ error: 'Invalid token' })
  }
}
