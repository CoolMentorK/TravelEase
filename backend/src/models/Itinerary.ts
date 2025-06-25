import type { Document, CallbackError } from 'mongoose'
import mongoose, { Schema } from 'mongoose'

export interface IItineraryItem {
  _id?: string
  title: string
  location: string
  time: string
  duration: string
  category: string
  price?: string
  rating?: number
  notes?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface IItinerary extends Document {
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  items: IItineraryItem[]
  totalCost: number
  isPublic: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const ItineraryItemSchema = new Schema<IItineraryItem>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Attraction', 'Restaurant', 'Hotel', 'Transport', 'Shopping', 'Other'],
  },
  price: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  notes: {
    type: String,
    trim: true,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
})

const ItinerarySchema = new Schema<IItinerary>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    items: [ItineraryItemSchema],
    totalCost: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Calculate total cost before saving
ItinerarySchema.pre('save', function (this: IItinerary, next: (err?: CallbackError) => void) {
  this.totalCost = this.items.reduce((total: number, item: IItineraryItem) => {
    if (item.price) {
      const price = parseInt(item.price.replace(/[^0-9]/g, '') || '0')
      return total + price
    }
    return total
  }, 0)
  next()
})

export default mongoose.model<IItinerary>('Itinerary', ItinerarySchema)
