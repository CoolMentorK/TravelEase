// src/middlewares/protectVendor.ts
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import Vendor from '../models/Vendor'
import logger from '../config/logger'

interface JwtPayload {
    id: string
}

export interface VendorAuthRequest extends Request {
    vendor?: any
}

export const protectVendor = async (
    req: VendorAuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    if (!process.env.JWT_SECRET) {
        logger.error('JWT_SECRET not defined in environment')
        return res.status(500).json({ error: 'Internal server error' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
        const vendor = await Vendor.findById(decoded.id).select('-password')

        if (!vendor) {
            return res.status(401).json({ error: 'Vendor not found' })
        }

        req.vendor = vendor
        next()
    } catch (err) {
        logger.error('Vendor authentication failed:', err instanceof Error ? err.message : 'Invalid token')
        return res.status(401).json({ error: 'Invalid token' })
    }
}
