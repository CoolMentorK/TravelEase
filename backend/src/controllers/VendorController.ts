import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Vendor from '../models/Vendor'

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '3d' })
}

export const registerVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password, businessType, location } = req.body

    const exists = await Vendor.findOne({ email })
    if (exists) {
      res.status(400).json({ message: 'Vendor already exists' })
      return
    }

    const vendor = await Vendor.create({
      name,
      email,
      password,
      businessType,
      location,
    })

    const token = createToken(vendor.id)
    res.status(201).json({ vendor, token })
  } catch (err) {
    next(err)
  }
}

export const loginVendor = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body

    const vendor = await Vendor.findOne({ email })
    if (!vendor) {
      res.status(404).json({ message: 'Vendor not found' })
      return
    }

    const isMatch = await vendor.comparePassword(password)
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect password' })
      return
    }

    const token = createToken(vendor.id)
    res.status(200).json({ vendor, token })
  } catch (err) {
    next(err)
  }
}
