import { Request, Response } from 'express'
import Vendor from '../models/Vendor'
import jwt from 'jsonwebtoken'

const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '3d' })
}

export const registerVendor = async (req: Request, res: Response) => {
    const { name, email, password, businessType, location } = req.body
    try {
        const exists = await Vendor.findOne({ email })
        if (exists) return res.status(400).json({ message: 'Vendor already exists' })

        const vendor = await Vendor.create({ name, email, password, businessType, location })
        const token = createToken(vendor._id)
        res.status(201).json({ vendor, token })
    } catch (err) {
        res.status(500).json({ message: 'Registration failed', error: err })
    }
}

export const loginVendor = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        const vendor = await Vendor.findOne({ email })
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' })

        const isMatch = await vendor.comparePassword(password)
        if (!isMatch) return res.status(400).json({ message: 'Incorrect password' })

        const token = createToken(vendor._id)
        res.status(200).json({ vendor, token })
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err })
    }
}
