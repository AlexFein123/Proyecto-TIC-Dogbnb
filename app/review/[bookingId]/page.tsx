"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { mockHosts } from "@/lib/mock-data"
import type { Host } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StarIcon, ChevronLeftIcon, CheckCircleIcon, CameraIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ReviewFormData {
  rating: number
  comment: string
  categories: {
    communication: number
    cleanliness: number
    petCare: number
    location: number
  }
  photos: string[]
}

// Mock booking data for the review
const mockBooking = {
  id: "3",
  hostId: "3",
  hostName: "Ana Martín",
  hostAvatar: "/young-woman-with-cats.jpg",
  startDate: new Date("2024-01-20"),
  endDate: new Date("2024-01-25"),
  pets: ["Luna"],
  location: "Valencia",
}

export default function ReviewPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.bookingId as string

  const [host, setHost] = useState<Host | null>(null)
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
    categories: {
      communication: 0,
      cleanliness: 0,
      petCare: 0,
      location: 0,
    },
    photos: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    // Find host based on mock booking
    const foundHost = mockHosts.find((h) => h.id === mockBooking.hostId)
    if (foundHost) {
      setHost(foundHost)
    }
  }, [])

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Reserva no encontrada</h2>
          <Link href="/dashboard">
            <Button>Volver al dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStarClick = (rating: number, category?: keyof ReviewFormData["categories"]) => {
    if (category) {
      setFormData((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: rating,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, rating }))
    }
  }

  const handleSubmit = async () => {
    if (formData.rating === 0 || !formData.comment.trim()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setReviewSubmitted(true)
    setIsSubmitting(false)
  }

  const canSubmit =
    formData.rating > 0 &&
    formData.comment.trim().length > 0 &&
    Object.values(formData.categories).every((rating) => rating > 0)

  if (reviewSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-2">¡Reseña enviada!</h2>
            <p className="text-muted-foreground mb-6">
              Gracias por compartir tu experiencia. Tu reseña ayudará a otros usuarios a tomar mejores decisiones.
            </p>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Volver al dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push(`/host/${host.id}`)}
              >
                Ver perfil del hospedador
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Volver al dashboard</span>
            </Link>
            <h1 className="text-lg font-semibold">Escribir reseña</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Booking Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                  <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{host.name}</h2>
                  <p className="text-muted-foreground">{mockBooking.location}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enero 20-25, 2024 • Mascotas: {mockBooking.pets.join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Calificación general</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">¿Cómo fue tu experiencia con {host.name}?</p>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      className="transition-colors hover:scale-110"
                    >
                      <StarIcon
                        className={cn(
                          "w-10 h-10",
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-200",
                        )}
                      />
                    </button>
                  ))}
                </div>

                {formData.rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formData.rating === 1 && "Muy malo"}
                    {formData.rating === 2 && "Malo"}
                    {formData.rating === 3 && "Regular"}
                    {formData.rating === 4 && "Bueno"}
                    {formData.rating === 5 && "Excelente"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Ratings */}
          <Card>
            <CardHeader>
              <CardTitle>Califica por categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "communication" as const,
                  label: "Comunicación",
                  description: "¿Qué tan bien se comunicó contigo?",
                },
                {
                  key: "petCare" as const,
                  label: "Cuidado de mascotas",
                  description: "¿Qué tan bien cuidó a tu mascota?",
                },
                { key: "cleanliness" as const, label: "Limpieza", description: "¿Qué tan limpio estaba el lugar?" },
                { key: "location" as const, label: "Ubicación", description: "¿Qué te pareció la ubicación?" },
              ].map((category) => (
                <div key={category.key} className="space-y-2">
                  <div>
                    <h4 className="font-medium">{category.label}</h4>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star, category.key)}
                        className="transition-colors hover:scale-110"
                      >
                        <StarIcon
                          className={cn(
                            "w-6 h-6",
                            star <= formData.categories[category.key]
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-200",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Written Review */}
          <Card>
            <CardHeader>
              <CardTitle>Escribe tu reseña</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="comment">Cuéntanos sobre tu experiencia</Label>
                <Textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Describe tu experiencia con el hospedador. ¿Cómo fue el cuidado de tu mascota? ¿Recomendarías este servicio?"
                  className="mt-2 min-h-32"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.comment.length}/500 caracteres</p>
              </div>

              {/* Photo Upload */}
              <div>
                <Label>Agregar fotos (opcional)</Label>
                <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <CameraIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Agrega fotos de tu mascota durante la estadía</p>
                  <Button variant="outline" size="sm">
                    Seleccionar fotos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push("/dashboard")}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Enviando..." : "Publicar reseña"}
            </Button>
          </div>

          {!canSubmit && (
            <p className="text-sm text-muted-foreground text-center">
              Completa la calificación general, todas las categorías y escribe un comentario para continuar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
