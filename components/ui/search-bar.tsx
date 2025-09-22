"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch?: (filters: {
    location: string
    startDate?: Date
    endDate?: Date
    petType?: string
    petWeight?: number
  }) => void
  className?: string
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [location, setLocation] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [petType, setPetType] = useState<string>()
  const [petWeight, setPetWeight] = useState<number>()

  const handleSearch = () => {
    onSearch?.({
      location,
      startDate,
      endDate,
      petType,
      petWeight,
    })
  }

  return (
    <div className={cn("flex flex-col md:flex-row gap-4 p-4 bg-card rounded-2xl shadow-sm border", className)}>
      {/* Location */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">¿Dónde?</label>
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ciudad o dirección"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Check-in Date */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Entrada</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "dd MMM", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Check-out Date */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Salida</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "dd MMM", { locale: es }) : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => date < (startDate || new Date())}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Pet Type */}
      <div className="flex-1">
        <label className="block text-sm font-medium mb-2">Tipo de mascota</label>
        <Select value={petType} onValueChange={setPetType}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar" />
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

      {/* Search Button */}
      <div className="flex items-end">
        <Button onClick={handleSearch} className="w-full md:w-auto px-8">
          <SearchIcon className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>
    </div>
  )
}
