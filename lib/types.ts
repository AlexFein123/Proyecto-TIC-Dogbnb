export interface Pet {
  id: string
  name: string
  species: "dog" | "cat" | "bird" | "rabbit" | "other"
  breed?: string
  weight: number // in kg
  age: number // in years
  specialNeeds?: string[]
  photos: string[]
  ownerId: string
}

export interface Host {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  bio: string
  location: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  amenities: Amenity[]
  pricePerNight: number
  rating: number
  reviewCount: number
  verified: boolean
  responseTime: string // e.g., "within 1 hour"
  acceptedPetTypes: Pet["species"][]
  maxPetWeight: number
  photos: string[]
  availability: DateRange[]
  discounts: {
    weeklyDiscount: number // percentage
    monthlyDiscount: number // percentage
  }
  policies: {
    cancellationPolicy: string
    houseRules: string[]
  }
}

export interface Amenity {
  id: string
  name: string
  icon: string
  category: "safety" | "comfort" | "services" | "outdoor"
}

export interface DateRange {
  startDate: Date
  endDate: Date
  available: boolean
}

export interface Booking {
  id: string
  hostId: string
  ownerId: string
  petIds: string[]
  startDate: Date
  endDate: Date
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  specialRequests?: string
  createdAt: Date
  priceBreakdown: {
    basePrice: number
    nights: number
    discount: number
    serviceFee: number
    total: number
  }
}

export interface Review {
  id: string
  bookingId: string
  reviewerId: string
  revieweeId: string
  rating: number
  comment: string
  photos?: string[]
  createdAt: Date
  categories: {
    communication: number
    cleanliness: number
    petCare: number
    location: number
  }
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  attachments?: {
    type: "image" | "document"
    url: string
    name: string
  }[]
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone?: string
  isHost: boolean
  pets: Pet[]
  createdAt: Date
  preferences: {
    notifications: boolean
    darkMode: boolean
    language: string
  }
}

export interface SearchFilters {
  location?: string
  startDate?: Date
  endDate?: Date
  petType?: Pet["species"]
  petWeight?: number
  priceRange?: {
    min: number
    max: number
  }
  amenities?: string[]
  rating?: number
  instantBook?: boolean
  distance?: number // in km
}
