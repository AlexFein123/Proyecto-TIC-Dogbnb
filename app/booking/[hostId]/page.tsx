"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { mockHosts } from "@/lib/mock-data"
import type { Host, Pet } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon, CheckCircleIcon } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"

interface BookingFormData {
  dateRange?: DateRange
  pets: {
    name: string
    species: Pet["species"]
    weight: number
    specialNeeds: string
  }[]
  specialRequests: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  couponCode: string
}

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const hostId = params.hostId as string

  const [host, setHost] = useState<Host | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<BookingFormData>({
    pets: [{ name: "", species: "dog", weight: 0, specialNeeds: "" }],
    specialRequests: "",
    contactInfo: { name: "", email: "", phone: "" },
    couponCode: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  useEffect(() => {
    const foundHost = mockHosts.find((h) => h.id === hostId)
    if (foundHost) {
      setHost(foundHost)
    }
  }, [hostId])

  if (!host) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Hospedador no encontrado</h2>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  const calculatePrice = () => {
    if (!formData.dateRange?.from || !formData.dateRange?.to) return null

    const nights = differenceInDays(formData.dateRange.to, formData.dateRange.from)
    const basePrice = host.pricePerNight * nights

    let discount = 0
    if (nights >= 14) {
      discount = basePrice * (host.discounts.monthlyDiscount / 100)
    } else if (nights >= 7) {
      discount = basePrice * (host.discounts.weeklyDiscount / 100)
    }

    // Coupon discount (simulate 10% off for "WELCOME10")
    let couponDiscount = 0
    if (formData.couponCode.toUpperCase() === "WELCOME10") {
      couponDiscount = basePrice * 0.1
    }

    const serviceFee = basePrice * 0.1
    const cleaningFee = 15 // Fixed cleaning fee
    const total = basePrice - discount - couponDiscount + serviceFee + cleaningFee

    return {
      nights,
      basePrice,
      discount,
      couponDiscount,
      serviceFee,
      cleaningFee,
      total,
    }
  }

  const addPet = () => {
    setFormData((prev) => ({
      ...prev,
      pets: [...prev.pets, { name: "", species: "dog", weight: 0, specialNeeds: "" }],
    }))
  }

  const removePet = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pets: prev.pets.filter((_, i) => i !== index),
    }))
  }

  const updatePet = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      pets: prev.pets.map((pet, i) => (i === index ? { ...pet, [field]: value } : pet)),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setBookingComplete(true)
    setIsSubmitting(false)
  }

  const canProceedToStep2 =
    formData.dateRange?.from && formData.dateRange?.to && formData.pets.every((pet) => pet.name && pet.weight > 0)

  const canProceedToStep3 = canProceedToStep2

  const canSubmit =
    canProceedToStep3 && formData.contactInfo.name && formData.contactInfo.email && formData.contactInfo.phone

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-2">¡Solicitud enviada!</h2>
            <p className="text-muted-foreground mb-6">
              Tu solicitud de reserva ha sido enviada a {host.name}. Te notificaremos cuando responda.
            </p>

            <div className="space-y-3">
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Ver mis reservas
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/")}>
                Volver al inicio
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
            <Link href={`/host/${hostId}`} className="flex items-center gap-2">
              <ChevronLeftIcon className="w-5 h-5" />
              <span>Volver al perfil</span>
            </Link>

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={host.avatar || "/placeholder.svg"} alt={host.name} />
                <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{host.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {step}
                </div>
                {step < 3 && <div className={cn("w-16 h-0.5 mx-2", step < currentStep ? "bg-primary" : "bg-muted")} />}
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <div className="text-center">
              <h2 className="text-xl font-bold">
                {currentStep === 1 && "Fechas y mascotas"}
                {currentStep === 2 && "Resumen y precio"}
                {currentStep === 3 && "Información de contacto"}
              </h2>
              <p className="text-muted-foreground">Paso {currentStep} de 3</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Dates and Pets */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Selecciona fechas y mascotas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-base font-medium">Fechas de hospedaje</Label>
                    <div className="mt-2">
                      <Calendar
                        mode="range"
                        selected={formData.dateRange}
                        onSelect={(range) => setFormData((prev) => ({ ...prev, dateRange: range }))}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                  </div>

                  {/* Pet Information */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base font-medium">Información de mascotas</Label>
                      <Button variant="outline" size="sm" onClick={addPet}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Agregar mascota
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.pets.map((pet, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-medium">Mascota {index + 1}</h4>
                            {formData.pets.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => removePet(index)}>
                                <XIcon className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`pet-name-${index}`}>Nombre</Label>
                              <Input
                                id={`pet-name-${index}`}
                                value={pet.name}
                                onChange={(e) => updatePet(index, "name", e.target.value)}
                                placeholder="Nombre de la mascota"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`pet-species-${index}`}>Tipo</Label>
                              <Select value={pet.species} onValueChange={(value) => updatePet(index, "species", value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="dog">Perro</SelectItem>
                                  <SelectItem value="cat">Gato</SelectItem>
                                  <SelectItem value="bird">Ave</SelectItem>
                                  <SelectItem value="rabbit">Conejo</SelectItem>
                                  <SelectItem value="other">Otro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor={`pet-weight-${index}`}>Peso (kg)</Label>
                              <Input
                                id={`pet-weight-${index}`}
                                type="number"
                                value={pet.weight || ""}
                                onChange={(e) => updatePet(index, "weight", Number.parseFloat(e.target.value) || 0)}
                                placeholder="0"
                                min="0"
                                step="0.1"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`pet-needs-${index}`}>Necesidades especiales</Label>
                              <Input
                                id={`pet-needs-${index}`}
                                value={pet.specialNeeds}
                                onChange={(e) => updatePet(index, "specialNeeds", e.target.value)}
                                placeholder="Medicamentos, alergias, etc."
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="special-requests" className="text-base font-medium">
                      Solicitudes especiales (opcional)
                    </Label>
                    <Textarea
                      id="special-requests"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="¿Hay algo específico que el hospedador debería saber?"
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                      Continuar
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Price Summary */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de la reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Detalles de la reserva</h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fechas:</span>
                        <span>
                          {formData.dateRange?.from &&
                            formData.dateRange?.to &&
                            `${format(formData.dateRange.from, "dd MMM", { locale: es })} - ${format(formData.dateRange.to, "dd MMM", { locale: es })}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Mascotas:</span>
                        <span>{formData.pets.length}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Hospedador:</span>
                        <span>{host.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pet Summary */}
                  <div>
                    <h4 className="font-medium mb-3">Mascotas a hospedar</h4>
                    <div className="space-y-2">
                      {formData.pets.map((pet, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <span className="font-medium">{pet.name}</span>
                            <span className="text-muted-foreground ml-2">
                              (
                              {pet.species === "dog"
                                ? "Perro"
                                : pet.species === "cat"
                                  ? "Gato"
                                  : pet.species === "bird"
                                    ? "Ave"
                                    : pet.species === "rabbit"
                                      ? "Conejo"
                                      : "Otro"}
                              , {pet.weight}kg)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <Label htmlFor="coupon">Código de cupón (opcional)</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="coupon"
                        value={formData.couponCode}
                        onChange={(e) => setFormData((prev) => ({ ...prev, couponCode: e.target.value }))}
                        placeholder="Ingresa tu código"
                      />
                      <Button variant="outline">Aplicar</Button>
                    </div>
                    {formData.couponCode.toUpperCase() === "WELCOME10" && (
                      <p className="text-sm text-green-600 mt-1">✓ Cupón aplicado: 10% de descuento</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <ChevronLeftIcon className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                    <Button className="flex-1" onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                      Continuar
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-name">Nombre completo</Label>
                      <Input
                        id="contact-name"
                        value={formData.contactInfo.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, name: e.target.value },
                          }))
                        }
                        placeholder="Tu nombre completo"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value },
                          }))
                        }
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="contact-phone">Teléfono</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, phone: e.target.value },
                          }))
                        }
                        placeholder="+34 666 123 456"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Importante</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Tu solicitud será enviada al hospedador para su aprobación</li>
                      <li>• Recibirás una notificación cuando el hospedador responda</li>
                      <li>• No se realizará ningún cargo hasta que la reserva sea confirmada</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      <ChevronLeftIcon className="w-4 h-4 mr-2" />
                      Atrás
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit} disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Enviando..." : "Enviar solicitud"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Price Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Image
                    src={host.photos[0] || "/placeholder.svg"}
                    alt={host.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-semibold">{host.name}</div>
                    <div className="text-sm text-muted-foreground">{host.location.city}</div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {calculatePrice() ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>
                        {host.pricePerNight}€ x {calculatePrice()!.nights} noches
                      </span>
                      <span>{calculatePrice()!.basePrice}€</span>
                    </div>

                    {calculatePrice()!.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento {calculatePrice()!.nights >= 14 ? "mensual" : "semanal"}</span>
                        <span>-{calculatePrice()!.discount.toFixed(2)}€</span>
                      </div>
                    )}

                    {calculatePrice()!.couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Cupón WELCOME10</span>
                        <span>-{calculatePrice()!.couponDiscount.toFixed(2)}€</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Tarifa de limpieza</span>
                      <span>{calculatePrice()!.cleaningFee}€</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tarifa de servicio</span>
                      <span>{calculatePrice()!.serviceFee.toFixed(2)}€</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{calculatePrice()!.total.toFixed(2)}€</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Selecciona las fechas para ver el precio</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
