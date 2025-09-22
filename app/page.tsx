"use client"

import { useState } from "react"
import { SearchBar } from "@/components/ui/search-bar"
import { HostCard } from "@/components/ui/host-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockHosts } from "@/lib/mock-data"
import { HeartIcon, ShieldCheckIcon, MessageCircleIcon, StarIcon } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [searchFilters, setSearchFilters] = useState<any>({})

  const handleSearch = (filters: any) => {
    setSearchFilters(filters)
    // TODO: Implement actual search logic
    console.log("Searching with filters:", filters)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <HeartIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">PetStay</h1>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost">Buscar hospedador</Button>
              <Button variant="ghost">Ser hospedador</Button>
              <Button variant="ghost">Ayuda</Button>
              <Button>Iniciar sesión</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
              Encuentra el cuidador perfecto para tu mascota
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Conectamos a dueños de mascotas con cuidadores verificados y confiables. Tu mascota se sentirá como en
              casa.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Hosts */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Hospedadores destacados</h3>
            <Button variant="outline">Ver todos</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockHosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">¿Cómo funciona?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tres simples pasos para encontrar el cuidado perfecto para tu mascota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">1. Busca y compara</h4>
                <p className="text-muted-foreground">
                  Encuentra hospedadores cerca de ti y compara precios, servicios y reseñas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircleIcon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">2. Conecta y reserva</h4>
                <p className="text-muted-foreground">
                  Chatea con el hospedador, conoce sus servicios y reserva las fechas que necesites.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartIcon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold mb-2">3. Relájate y disfruta</h4>
                <p className="text-muted-foreground">
                  Tu mascota estará en buenas manos mientras tú disfrutas de tu tiempo libre.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Seguridad y confianza</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Hospedadores verificados</h4>
                    <p className="text-muted-foreground">
                      Todos nuestros hospedadores pasan por un proceso de verificación riguroso.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <StarIcon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Sistema de reseñas</h4>
                    <p className="text-muted-foreground">
                      Lee reseñas reales de otros dueños de mascotas para tomar la mejor decisión.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircleIcon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Comunicación directa</h4>
                    <p className="text-muted-foreground">
                      Mantente en contacto con el hospedador y recibe actualizaciones de tu mascota.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96">
              <Image
                src="/happy-pets-with-caring-host.jpg"
                alt="Mascotas felices con cuidador"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold">PetStay</h1>
              </div>
              <p className="text-muted-foreground">La plataforma de confianza para el cuidado de mascotas.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para dueños</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Buscar hospedador
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Seguridad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para hospedadores</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Ser hospedador
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Centro de recursos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Centro de ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 PetStay. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Fix missing SearchIcon import
import { SearchIcon } from "lucide-react"
