"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { mockHosts, mockReviews } from "@/lib/mock-data"
import type { Host, Review } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { ReviewCard } from "@/components/ui/review-card"
import {
  StarIcon,
  MapPinIcon,
  CheckCircleIcon,
  MessageCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { differenceInDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export default function HostProfilePage() {
  const params = useParams()
  const hostId = params.id as string

  const [host, setHost] = useState<Host | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    // Simulate API call
    const foundHost = mockHosts.find((h) => h.id === hostId)
    if (foundHost) {
      setHost(foundHost)
      // Get reviews for this host
      const hostReviews = mockReviews.filter((r) => r.revieweeId === hostId)
      setReviews(hostReviews)
    }
  }, [hostId])

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hospedador no encontrado</h2>
          <p className="text-muted-foreground mb-4">El hospedador que buscas no existe.</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const calculatePrice = () => {
    if (!dateRange?.from || !dateRange?.to) return null

    const nights = differenceInDays(dateRange.to, dateRange.from)
    const basePrice = host.pricePerNight * nights

    let discount = 0
    if (nights >= 14) {
      discount = basePrice * (host.discounts.monthlyDiscount / 100)
    } else if (nights >= 7) {
      discount = basePrice * (host.discounts.weeklyDiscount / 100)
    }

    const serviceFee = basePrice * 0.1 // 10% service fee
    const total = basePrice - discount + serviceFee

    return {
      nights,
      basePrice,
      discount,
      serviceFee,
      total,
    }
  }

  const priceCalculation = calculatePrice()

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === host.photos.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? host.photos.length - 1 : prev - 1))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Volver</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <MessageCircleIcon className="w-4 h-4 mr-2" />
                Compartir
              </Button>
              <Button variant="ghost" size="sm">
                ♡ Guardar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src={host.photos[selectedImageIndex] || "/placeholder.svg"}
                  alt={`Foto ${selectedImageIndex + 1} de ${host.name}`}
                  fill
                  className="object-cover"
                />

                {host.photos.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {host.photos.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Grid */}
              {host.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {host.photos.slice(0, 4).map((photo, index) => (
                    <button
                      key={index}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === selectedImageIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Host Info */}
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                    <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold">{host.name}</h1>
                      {host.verified && (
                        <Badge variant="secondary" className="text-primary">
                          <CheckCircleIcon className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        {host.location.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {host.rating} ({host.reviewCount} reseñas)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold">{host.pricePerNight}€</div>
                  <div className="text-sm text-muted-foreground">por noche</div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">{host.bio}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Tiempo de respuesta</h3>
                  <p className="text-muted-foreground">{host.responseTime}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Tipos de mascota</h3>
                  <div className="flex flex-wrap gap-1">
                    {host.acceptedPetTypes.map((type) => (
                      <Badge key={type} variant="outline">
                        {type === "dog"
                          ? "Perros"
                          : type === "cat"
                            ? "Gatos"
                            : type === "bird"
                              ? "Aves"
                              : type === "rabbit"
                                ? "Conejos"
                                : "Otros"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold mb-4">Servicios incluidos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {host.amenities.map((amenity) => (
                  <div key={amenity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Reseñas ({host.reviewCount})</h2>
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold">{host.rating}</span>
                </div>
              </div>

              {/* Review Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {reviews.length > 0 && (
                  <>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {(reviews.reduce((acc, r) => acc + r.categories.communication, 0) / reviews.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Comunicación</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {(reviews.reduce((acc, r) => acc + r.categories.petCare, 0) / reviews.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Cuidado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {(reviews.reduce((acc, r) => acc + r.categories.cleanliness, 0) / reviews.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Limpieza</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {(reviews.reduce((acc, r) => acc + r.categories.location, 0) / reviews.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground">Ubicación</div>
                    </div>
                  </>
                )}
              </div>

              {/* Review List */}
              <div className="space-y-6">
                {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {reviews.length > 3 && (
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Ver menos reseñas" : `Ver todas las reseñas (${reviews.length})`}
                </Button>
              )}
            </div>

            {/* Policies */}
            <div>
              <h2 className="text-xl font-bold mb-4">Políticas</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Política de cancelación</h3>
                  <p className="text-muted-foreground">{host.policies.cancellationPolicy}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Normas de la casa</h3>
                  <ul className="space-y-1">
                    {host.policies.houseRules.map((rule, index) => (
                      <li key={index} className="text-muted-foreground flex items-center gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{host.pricePerNight}€ / noche</span>
                  <div className="flex items-center gap-1 text-sm">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {host.rating} ({host.reviewCount})
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Selecciona las fechas</label>
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Price Breakdown */}
                {priceCalculation && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between">
                      <span>
                        {host.pricePerNight}€ x {priceCalculation.nights} noches
                      </span>
                      <span>{priceCalculation.basePrice}€</span>
                    </div>

                    {priceCalculation.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>
                          Descuento {priceCalculation.nights >= 14 ? "mensual" : "semanal"}(
                          {priceCalculation.nights >= 14
                            ? host.discounts.monthlyDiscount
                            : host.discounts.weeklyDiscount}
                          %)
                        </span>
                        <span>-{priceCalculation.discount.toFixed(2)}€</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Tarifa de servicio</span>
                      <span>{priceCalculation.serviceFee.toFixed(2)}€</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{priceCalculation.total.toFixed(2)}€</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Link href={`/booking/${host.id}`}>
                    <Button className="w-full" disabled={!dateRange?.from || !dateRange?.to}>
                      Reservar ahora
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircleIcon className="w-4 h-4 mr-2" />
                    Contactar hospedador
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">No se realizará ningún cargo todavía</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
