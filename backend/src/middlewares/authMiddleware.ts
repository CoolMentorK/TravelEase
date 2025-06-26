import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import logger from '../config/logger'

interface JwtPayload {
  id: string
  email?: string // add other fields you encode in the token
}

// Export AuthRequest interface
export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or malformed token' })
    return
  }

  const token = authHeader.split(' ')[1]

  if (!process.env.JWT_SECRET) {
    logger.error('Authentication error: JWT_SECRET not set')
    res.status(500).json({ error: 'Server configuration error' })
    return
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    next()
  } catch (err) {
    logger.error('Authentication error:', err instanceof Error ? err.message : String(err))
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
