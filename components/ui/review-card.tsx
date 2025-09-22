import type { Review } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"

interface ReviewCardProps {
  review: Review
  showPhotos?: boolean
  className?: string
}

export function ReviewCard({ review, showPhotos = true, className }: ReviewCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm font-medium">{review.rating}.0</span>
              </div>

              <span className="text-sm text-muted-foreground">
                {format(review.createdAt, "MMMM yyyy", { locale: es })}
              </span>
            </div>

            {/* Category Ratings */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Comunicación:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.categories.communication ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Cuidado:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.categories.petCare ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Limpieza:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.categories.cleanliness ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Ubicación:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.categories.location ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Comment */}
            <p className="text-muted-foreground leading-relaxed">{review.comment}</p>

            {/* Photos */}
            {showPhotos && review.photos && review.photos.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.photos.slice(0, 3).map((photo, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={photo || "/placeholder.svg"}
                      alt={`Foto de reseña ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
                {review.photos.length > 3 && (
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    +{review.photos.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
