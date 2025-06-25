import express from 'express'
import {
  getUserItineraries,
  getItinerary,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  addItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
} from '../controllers/itineraryController'

const router = express.Router()

// Itinerary routes
router.get('/user/:userId', getUserItineraries)
router.get('/:id', getItinerary)
router.post('/', createItinerary)
router.put('/:id', updateItinerary)
router.delete('/:id', deleteItinerary)

// Itinerary item routes
router.post('/:id/items', addItineraryItem)
router.put('/:id/items/:itemId', updateItineraryItem)
router.delete('/:id/items/:itemId', deleteItineraryItem)

export default router
