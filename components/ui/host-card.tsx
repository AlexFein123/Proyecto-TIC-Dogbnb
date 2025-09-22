"use client"

import type { Host } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon, MapPinIcon, CheckCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface HostCardProps {
  host: Host
  className?: string
}

export function HostCard({ host, className }: HostCardProps) {
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="relative h-48">
        <Image src={host.photos[0] || "/placeholder.svg"} alt={`Casa de ${host.name}`} fill className="object-cover" />
        {host.verified && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-primary">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Verificado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image
              src={host.avatar || "/placeholder.svg"}
              alt={host.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-sm">{host.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {host.location.city}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{host.rating}</span>
            <span className="text-xs text-muted-foreground">({host.reviewCount})</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {host.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity.id} variant="outline" className="text-xs">
              {amenity.icon} {amenity.name}
            </Badge>
          ))}
          {host.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{host.amenities.length - 3} más
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold">{host.pricePerNight}€</span>
            <span className="text-sm text-muted-foreground"> / noche</span>
          </div>

          <Link href={`/host/${host.id}`}>
            <Button size="sm">Ver detalles</Button>
          </Link>
        </div>

        <div className="mt-2 text-xs text-muted-foreground">Responde {host.responseTime}</div>
      </CardContent>
    </Card>
  )
}
