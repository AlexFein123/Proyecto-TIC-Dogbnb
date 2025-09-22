import type { Host, Pet, Review, User, Amenity, Message, Conversation } from "./types"

export const amenities: Amenity[] = [
  { id: "1", name: "Patio/Jardín", icon: "🌿", category: "outdoor" },
  { id: "2", name: "Cámaras de seguridad", icon: "📹", category: "safety" },
  { id: "3", name: "Paseos diarios", icon: "🚶", category: "services" },
  { id: "4", name: "Administración de medicamentos", icon: "💊", category: "services" },
  { id: "5", name: "Casa con niños", icon: "👶", category: "comfort" },
  { id: "6", name: "Otros animales", icon: "🐕", category: "comfort" },
  { id: "7", name: "Recogida/Entrega", icon: "🚗", category: "services" },
  { id: "8", name: "Cuidado 24/7", icon: "🕐", category: "services" },
]

export const mockHosts: Host[] = [
  {
    id: "1",
    name: "María González",
    email: "maria@example.com",
    phone: "+34 666 123 456",
    avatar: "/friendly-woman-with-pets.jpg",
    bio: "Amante de los animales con 5 años de experiencia cuidando mascotas. Tengo un jardín grande y mucho tiempo para dedicar a tus peludos. Me encanta pasear con los perros y jugar con los gatos. Vivo en una casa tranquila con patio donde las mascotas pueden correr y jugar libremente.",
    location: {
      address: "Calle Mayor 123",
      city: "Madrid",
      coordinates: { lat: 40.4168, lng: -3.7038 },
    },
    amenities: [amenities[0], amenities[2], amenities[4]],
    pricePerNight: 25,
    rating: 4.8,
    reviewCount: 47,
    verified: true,
    responseTime: "en 1 hora",
    acceptedPetTypes: ["dog", "cat"],
    maxPetWeight: 30,
    photos: ["/cozy-living-room-with-pet-bed.jpg", "/backyard-garden-for-pets.jpg", "/pet-feeding-area.jpg"],
    availability: [],
    discounts: { weeklyDiscount: 10, monthlyDiscount: 20 },
    policies: {
      cancellationPolicy: "Cancelación gratuita hasta 24h antes",
      houseRules: ["No fumar", "Mascotas vacunadas", "Máximo 2 mascotas"],
    },
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    phone: "+34 666 789 012",
    avatar: "/man-and-loyal-companion.png",
    bio: "Veterinario jubilado con experiencia en cuidado de mascotas especiales. Especializado en administración de medicamentos y cuidados médicos. Tengo más de 20 años de experiencia profesional y ahora dedico mi tiempo a cuidar mascotas que necesitan atención especial.",
    location: {
      address: "Avenida de la Paz 45",
      city: "Barcelona",
      coordinates: { lat: 41.3851, lng: 2.1734 },
    },
    amenities: [amenities[1], amenities[3], amenities[7]],
    pricePerNight: 35,
    rating: 4.9,
    reviewCount: 23,
    verified: true,
    responseTime: "en 30 minutos",
    acceptedPetTypes: ["dog", "cat", "bird", "rabbit"],
    maxPetWeight: 50,
    photos: ["/veterinary-care-setup-at-home.jpg", "/secure-pet-area-with-cameras.jpg", "/medication-storage-area.jpg"],
    availability: [],
    discounts: { weeklyDiscount: 15, monthlyDiscount: 25 },
    policies: {
      cancellationPolicy: "Cancelación gratuita hasta 48h antes",
      houseRules: ["Mascotas con historial médico", "Vacunas al día", "Consulta previa obligatoria"],
    },
  },
  {
    id: "3",
    name: "Ana Martín",
    email: "ana@example.com",
    phone: "+34 666 345 678",
    avatar: "/young-woman-with-cats.jpg",
    bio: "Estudiante de veterinaria que adora los gatos. Apartamento tranquilo perfecto para felinos tímidos. Tengo experiencia especial con gatos rescatados y mascotas que necesitan un ambiente calmado. Mi apartamento está diseñado pensando en el bienestar felino.",
    location: {
      address: "Plaza del Sol 8",
      city: "Valencia",
      coordinates: { lat: 39.4699, lng: -0.3763 },
    },
    amenities: [amenities[1], amenities[4], amenities[5]],
    pricePerNight: 20,
    rating: 4.7,
    reviewCount: 31,
    verified: true,
    responseTime: "en 2 horas",
    acceptedPetTypes: ["cat", "rabbit"],
    maxPetWeight: 15,
    photos: [
      "/cat-friendly-apartment-with-toys.jpg",
      "/sunny-window-with-cat-perch.jpg",
      "/quiet-study-area-with-pet-bed.jpg",
    ],
    availability: [],
    discounts: { weeklyDiscount: 8, monthlyDiscount: 15 },
    policies: {
      cancellationPolicy: "Cancelación gratuita hasta 12h antes",
      houseRules: ["Solo gatos y conejos", "Ambiente tranquilo", "Visita previa recomendada"],
    },
  },
]

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    weight: 25,
    age: 3,
    specialNeeds: ["Medicación para artritis"],
    photos: ["/golden-retriever.png"],
    ownerId: "user1",
  },
  {
    id: "2",
    name: "Luna",
    species: "cat",
    breed: "Siamés",
    weight: 4,
    age: 2,
    photos: ["/siamese-cat.png"],
    ownerId: "user1",
  },
]

export const mockReviews: Review[] = [
  {
    id: "1",
    bookingId: "booking1",
    reviewerId: "user1",
    revieweeId: "1",
    rating: 5,
    comment:
      "María cuidó perfectamente de Max. Recibí fotos diarias y se notaba que estaba muy feliz. ¡Totalmente recomendable!",
    createdAt: new Date("2024-01-15"),
    categories: {
      communication: 5,
      cleanliness: 5,
      petCare: 5,
      location: 4,
    },
  },
  {
    id: "2",
    bookingId: "booking2",
    reviewerId: "user2",
    revieweeId: "2",
    rating: 5,
    comment:
      "Carlos es un profesional increíble. Su experiencia como veterinario se nota mucho. Mi gato con diabetes estuvo en las mejores manos.",
    createdAt: new Date("2024-01-10"),
    categories: {
      communication: 5,
      cleanliness: 5,
      petCare: 5,
      location: 5,
    },
  },
]

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "Pedro Sánchez",
    email: "pedro@example.com",
    avatar: "/man-with-pet.jpg",
    pets: [mockPets[0], mockPets[1]],
    isHost: false,
    createdAt: new Date("2023-06-01"),
    preferences: {
      notifications: true,
      darkMode: false,
      language: "es",
    },
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    conversationId: "conv1",
    senderId: "user1",
    content: "Hola María, estoy interesado en hospedar a Max del 15 al 18 de febrero. ¿Estarías disponible?",
    timestamp: new Date("2024-02-01T10:00:00"),
    read: true,
  },
  {
    id: "2",
    conversationId: "conv1",
    senderId: "1",
    content:
      "¡Hola Pedro! Sí, esas fechas están libres. Me encantaría conocer a Max. ¿Podrías contarme un poco más sobre él?",
    timestamp: new Date("2024-02-01T10:30:00"),
    read: true,
  },
  {
    id: "3",
    conversationId: "conv1",
    senderId: "user1",
    content:
      "Max es un Golden Retriever de 3 años, muy tranquilo y sociable. Necesita medicación para la artritis dos veces al día.",
    timestamp: new Date("2024-02-01T11:00:00"),
    read: true,
  },
  {
    id: "4",
    conversationId: "conv1",
    senderId: "1",
    content:
      "Perfecto, tengo experiencia con medicación. ¿Te parece bien si nos vemos antes para que Max se acostumbre a mí?",
    timestamp: new Date("2024-02-01T11:15:00"),
    read: false,
  },
  {
    id: "5",
    conversationId: "conv2",
    senderId: "user1",
    content:
      "Hola Carlos, vi tu perfil y me interesa mucho tu experiencia como veterinario. ¿Podrías cuidar a mi gata Luna?",
    timestamp: new Date("2024-02-02T14:00:00"),
    read: true,
  },
  {
    id: "6",
    conversationId: "conv2",
    senderId: "2",
    content: "¡Hola! Por supuesto, me encantan los gatos. ¿Luna tiene alguna necesidad especial?",
    timestamp: new Date("2024-02-02T14:30:00"),
    read: true,
  },
]

export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participants: ["user1", "1"],
    lastMessage: mockMessages[3],
    createdAt: new Date("2024-02-01T10:00:00"),
    updatedAt: new Date("2024-02-01T11:15:00"),
  },
  {
    id: "conv2",
    participants: ["user1", "2"],
    lastMessage: mockMessages[5],
    createdAt: new Date("2024-02-02T14:00:00"),
    updatedAt: new Date("2024-02-02T14:30:00"),
  },
]
