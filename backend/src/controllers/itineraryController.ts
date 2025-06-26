import type { Request, Response } from 'express'
import type { IItineraryItem } from '../models/Itinerary'
import Itinerary from '../models/Itinerary.js'

// Get all itineraries for a user
export const getUserItineraries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params
    const itineraries = await Itinerary.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: itineraries,
    })
  } catch (error) {
    console.error('Error fetching itineraries:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itineraries',
    })
  }
}

// Get a single itinerary
export const getItinerary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const itinerary = await Itinerary.findById(id)

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error fetching itinerary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch itinerary',
    })
  }
}

// Create a new itinerary
export const createItinerary = async (req: Request, res: Response): Promise<void> => {
  try {
    const itineraryData = req.body

    // For now, use a default userId (in real app, get from auth)
    const itinerary = new Itinerary({
      ...itineraryData,
      userId: itineraryData.userId || 'default-user',
    })

    await itinerary.save()

    res.status(201).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error creating itinerary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create itinerary',
    })
  }
}

// Update an itinerary
export const updateItinerary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    const itinerary = await Itinerary.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error updating itinerary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update itinerary',
    })
  }
}

// Delete an itinerary
export const deleteItinerary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const itinerary = await Itinerary.findByIdAndDelete(id)

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting itinerary:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary',
    })
  }
}

// Add item to itinerary
export const addItineraryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const itemData: IItineraryItem = req.body

    const itinerary = await Itinerary.findById(id)

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    itinerary.items.push(itemData)
    await itinerary.save()

    res.status(200).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error adding itinerary item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add itinerary item',
    })
  }
}

// Update itinerary item
export const updateItineraryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, itemId } = req.params
    const updateData = req.body

    const itinerary = await Itinerary.findById(id)

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    const itemIndex = itinerary.items.findIndex(item => item._id?.toString() === itemId)

    if (itemIndex === -1) {
      res.status(404).json({
        success: false,
        message: 'Itinerary item not found',
      })
      return
    }

    itinerary.items[itemIndex] = { ...itinerary.items[itemIndex], ...updateData }
    await itinerary.save()

    res.status(200).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error updating itinerary item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update itinerary item',
    })
  }
}

// Delete itinerary item
export const deleteItineraryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, itemId } = req.params

    const itinerary = await Itinerary.findById(id)

    if (!itinerary) {
      res.status(404).json({
        success: false,
        message: 'Itinerary not found',
      })
      return
    }

    itinerary.items = itinerary.items.filter(item => item._id?.toString() !== itemId)
    await itinerary.save()

    res.status(200).json({
      success: true,
      data: itinerary,
    })
  } catch (error) {
    console.error('Error deleting itinerary item:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete itinerary item',
    })
  }
}
