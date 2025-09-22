"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SearchBar } from "@/components/ui/search-bar"
import { HostCard } from "@/components/ui/host-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockHosts, amenities } from "@/lib/mock-data"
import type { Host, SearchFilters } from "@/lib/types"
import { MapIcon, ListIcon, SlidersHorizontalIcon } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [hosts, setHosts] = useState<Host[]>(mockHosts)
  const [filteredHosts, setFilteredHosts] = useState<Host[]>(mockHosts)
  const [showMap, setShowMap] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: { min: 0, max: 100 },
    rating: 0,
    amenities: [],
    instantBook: false,
  })

  useEffect(() => {
    // Apply filters
    let filtered = hosts

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter(
        (host) => host.pricePerNight >= filters.priceRange!.min && host.pricePerNight <= filters.priceRange!.max,
      )
    }

    // Rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter((host) => host.rating >= filters.rating!)
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((host) =>
        filters.amenities!.some((amenityId) => host.amenities.some((hostAmenity) => hostAmenity.id === amenityId)),
      )
    }

    // Pet type filter
    if (filters.petType) {
      filtered = filtered.filter((host) => host.acceptedPetTypes.includes(filters.petType as any))
    }

    setFilteredHosts(filtered)
  }, [filters, hosts])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 100 },
      rating: 0,
      amenities: [],
      instantBook: false,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <SearchBar
            onSearch={(searchFilters) => {
              // Update filters based on search
              setFilters((prev) => ({ ...prev, ...searchFilters }))
            }}
          />
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{filteredHosts.length} hospedadores encontrados</h1>
            <p className="text-muted-foreground">Hospedadores disponibles en tu área</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontalIcon className="w-4 h-4 mr-2" />
              Filtros
            </Button>

            <div className="hidden md:flex border rounded-lg">
              <Button
                variant={!showMap ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowMap(false)}
                className="rounded-r-none"
              >
                <ListIcon className="w-4 h-4 mr-2" />
                Lista
              </Button>
              <Button
                variant={showMap ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowMap(true)}
                className="rounded-l-none"
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filtros</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Limpiar
                    </Button>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-3">Precio por noche</h4>
                    <Slider
                      value={[filters.priceRange?.min || 0, filters.priceRange?.max || 100]}
                      onValueChange={([min, max]) => handleFilterChange("priceRange", { min, max })}
                      max={100}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{filters.priceRange?.min || 0}€</span>
                      <span>{filters.priceRange?.max || 100}€</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h4 className="font-medium mb-3">Calificación mínima</h4>
                    <Select
                      value={filters.rating?.toString() || "0"}
                      onValueChange={(value) => handleFilterChange("rating", Number.parseFloat(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Cualquier calificación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Cualquier calificación</SelectItem>
                        <SelectItem value="3">3+ estrellas</SelectItem>
                        <SelectItem value="4">4+ estrellas</SelectItem>
                        <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pet Type */}
                  <div>
                    <h4 className="font-medium mb-3">Tipo de mascota</h4>
                    <Select
                      value={filters.petType || "all"}
                      onValueChange={(value) => handleFilterChange("petType", value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="dog">Perros</SelectItem>
                        <SelectItem value="cat">Gatos</SelectItem>
                        <SelectItem value="bird">Aves</SelectItem>
                        <SelectItem value="rabbit">Conejos</SelectItem>
                        <SelectItem value="other">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-medium mb-3">Servicios</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {amenities.map((amenity) => (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={filters.amenities?.includes(amenity.id) || false}
                            onCheckedChange={(checked) => {
                              const currentAmenities = filters.amenities || []
                              if (checked) {
                                handleFilterChange("amenities", [...currentAmenities, amenity.id])
                              } else {
                                handleFilterChange(
                                  "amenities",
                                  currentAmenities.filter((id) => id !== amenity.id),
                                )
                              }
                            }}
                          />
                          <label
                            htmlFor={amenity.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <span>{amenity.icon}</span>
                            {amenity.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instant Book */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="instantBook"
                      checked={filters.instantBook || false}
                      onCheckedChange={(checked) => handleFilterChange("instantBook", checked)}
                    />
                    <label
                      htmlFor="instantBook"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Reserva inmediata
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {showMap ? (
              /* Map View */
              <Card className="h-96 mb-6">
                <CardContent className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Mapa próximamente</h3>
                    <p className="text-muted-foreground">
                      La vista de mapa estará disponible en una próxima actualización.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Host Grid */}
            {filteredHosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHosts.map((host) => (
                  <HostCard key={host.id} host={host} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
                  <p className="text-muted-foreground mb-4">
                    Intenta ajustar tus filtros para encontrar más hospedadores.
                  </p>
                  <Button onClick={clearFilters}>Limpiar filtros</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
