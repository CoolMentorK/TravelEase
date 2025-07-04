import { Request, Response } from 'express'
import Itinerary from '../models/itinerary'

export const saveGeneratedItinerary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id // from JWT middleware
    const { location, days, budget, suitable_for, itinerary } = req.body

    // Flatten all activities into one item list
        const items = itinerary.flatMap((day: any) =>
            day.activities.map((act: any) => ({
                title: act.name,
                location: act.address,
                time: act.best_time_to_visit,
                duration: `${act.duration_hours}h`,
                category: mapCategory(act.category), // helper below
                price: act.cost_usd ? `${act.cost_usd}` : '0',
                notes: act.notes || act.description || '',
            }))
        )

        const newItinerary = await Itinerary.create({
            userId,
            title: `Trip to ${location}`,
            description: `Auto-generated itinerary for ${suitable_for}`,
            startDate: new Date(),
            endDate: new Date(Date.now() + (days - 1) * 24 * 60 * 60 * 1000),
            items,
            isPublic: false,
            tags: [location, suitable_for],
        })

        res.status(201).json({
            message: 'Itinerary saved successfully',
            itinerary: newItinerary,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to save itinerary' })
    }
}

// Maps AI category to your schema enum
const mapCategory = (category: string): string => {
    const normalized = category.toLowerCase()
    if (normalized.includes('attraction')) return 'Attraction'
    if (normalized.includes('restaurant') || normalized.includes('food')) return 'Restaurant'
    if (normalized.includes('hotel')) return 'Hotel'
    if (normalized.includes('transport')) return 'Transport'
    if (normalized.includes('shop')) return 'Shopping'
    return 'Other'
}
