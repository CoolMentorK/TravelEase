import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import type { IVendor } from '../models/Vendor'
import Vendor from '../models/Vendor'
import logger from '../config/logger'

interface JwtPayload {
  id: string
}

export interface VendorAuthRequest extends Request {
  vendor?: IVendor
}

export const protectVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
  }

  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET not defined in environment')
    res.status(500).json({ error: 'Internal server error' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
    const vendor = await Vendor.findById(decoded.id).select('-password')

    if (!vendor) {
      res.status(401).json({ error: 'Vendor not found' })
      return
    }

    ;(req as VendorAuthRequest).vendor = vendor
    next()
  } catch (err) {
    logger.error(
      'Vendor authentication failed:',
      err instanceof Error ? err.message : 'Invalid token',
    )
    res.status(401).json({ error: 'Invalid token' })
  }
}
