import { Badge } from "@/components/ui/badge"
import type { Amenity } from "@/lib/types"

interface AmenityBadgeProps {
  amenity: Amenity
  variant?: "default" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
}

export function AmenityBadge({ amenity, variant = "outline", size = "md" }: AmenityBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge variant={variant} className={`${sizeClasses[size]} flex items-center gap-1`}>
      <span>{amenity.icon}</span>
      <span>{amenity.name}</span>
    </Badge>
  )
}
