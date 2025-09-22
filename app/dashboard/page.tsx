"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, MessageCircleIcon, StarIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    hostId: "1",
    hostName: "María González",
    hostAvatar: "/friendly-woman-with-pets.jpg",
    startDate: new Date("2024-03-15"),
    endDate: new Date("2024-03-18"),
    status: "pending" as const,
    totalPrice: 75,
    pets: ["Max"],
    location: "Madrid",
  },
  {
    id: "2",
    hostId: "2",
    hostName: "Carlos Ruiz",
    hostAvatar: "/man-and-loyal-companion.png",
    startDate: new Date("2024-02-10"),
    endDate: new Date("2024-02-14"),
    status: "confirmed" as const,
    totalPrice: 140,
    pets: ["Luna"],
    location: "Barcelona",
  },
  {
    id: "3",
    hostId: "3",
    hostName: "Ana Martín",
    hostAvatar: "/young-woman-with-cats.jpg",
    startDate: new Date("2024-01-20"),
    endDate: new Date("2024-01-25"),
    status: "completed" as const,
    totalPrice: 100,
    pets: ["Luna"],
    location: "Valencia",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("bookings")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <ClockIcon className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mi Dashboard</h1>
              <p className="text-muted-foreground">Gestiona tus reservas y perfil</p>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline">Buscar hospedadores</Button>
              </Link>
              <Avatar>
                <AvatarImage src="/man-with-pet.jpg" alt="Usuario" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Mis Reservas</TabsTrigger>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary">
                    {mockBookings.filter((b) => b.status === "pending").length}
                  </div>
                  <p className="text-muted-foreground">Pendientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">
                    {mockBookings.filter((b) => b.status === "confirmed").length}
                  </div>
                  <p className="text-muted-foreground">Confirmadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {mockBookings.filter((b) => b.status === "completed").length}
                  </div>
                  <p className="text-muted-foreground">Completadas</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={booking.hostAvatar || "/placeholder.svg"} alt={booking.hostName} />
                          <AvatarFallback>{booking.hostName.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="space-y-1">
                          <h3 className="font-semibold">{booking.hostName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.location}</p>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            {format(booking.startDate, "dd MMM", { locale: es })} -{" "}
                            {format(booking.endDate, "dd MMM", { locale: es })}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm">Mascotas: {booking.pets.join(", ")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        {getStatusBadge(booking.status)}
                        <div className="text-lg font-semibold">{booking.totalPrice}€</div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageCircleIcon className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          {booking.status === "completed" && (
                            <Link href={`/review/${booking.id}`}>
                              <Button size="sm" variant="outline">
                                <StarIcon className="w-4 h-4 mr-1" />
                                Reseña
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Mensajes</span>
                  <Link href="/chat">
                    <Button variant="outline" size="sm">
                      Ver todos
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircleIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay mensajes nuevos</h3>
                  <p className="text-muted-foreground mb-4">
                    Cuando tengas conversaciones con hospedadores, aparecerán aquí.
                  </p>
                  <Link href="/chat">
                    <Button>
                      <MessageCircleIcon className="w-4 h-4 mr-2" />
                      Ir a mensajes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src="/man-with-pet.jpg" alt="Usuario" />
                      <AvatarFallback>PS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Pedro Sánchez</h3>
                      <p className="text-muted-foreground">pedro@example.com</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Editar perfil
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mis mascotas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">🐕</div>
                      <div>
                        <div className="font-medium">Max</div>
                        <div className="text-sm text-muted-foreground">Golden Retriever, 25kg</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">🐱</div>
                      <div>
                        <div className="font-medium">Luna</div>
                        <div className="text-sm text-muted-foreground">Siamés, 4kg</div>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Agregar mascota
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
