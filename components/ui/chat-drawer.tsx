"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SendIcon, MessageCircleIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
}

interface ChatDrawerProps {
  hostId: string
  hostName: string
  hostAvatar?: string
  trigger?: React.ReactNode
  initialMessage?: string
}

export function ChatDrawer({ hostId, hostName, hostAvatar, trigger, initialMessage = "" }: ChatDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState(initialMessage)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isOpen && initialMessage && messages.length === 0) {
      // Send initial message when drawer opens
      setNewMessage(initialMessage)
    }
  }, [isOpen, initialMessage, messages.length])

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user1",
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate host response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)

      const responses = [
        "¡Hola! Gracias por contactarme. Me encantaría conocer más sobre tu mascota.",
        "Perfecto, estaré encantado de cuidar a tu mascota. ¿Cuándo necesitarías el servicio?",
        "Hola, me alegra saber de ti. ¿Podríamos programar una llamada para conocernos mejor?",
        "Gracias por tu interés. Te envío más información sobre mis servicios.",
      ]

      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: hostId,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(Date.now() + 1000),
      }

      setMessages((prev) => [...prev, response])
    }, 1500)
  }

  const formatTime = (timestamp: Date) => {
    return format(timestamp, "HH:mm", { locale: es })
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <MessageCircleIcon className="w-4 h-4 mr-2" />
            Contactar
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={hostAvatar || "/placeholder.svg"} alt={hostName} />
              <AvatarFallback>{hostName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <SheetTitle className="text-left">{hostName}</SheetTitle>
              <p className="text-sm text-muted-foreground">Hospedador</p>
            </div>
          </div>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">💬</div>
                <p className="text-sm text-muted-foreground">Inicia una conversación con {hostName}</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.senderId === "user1" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2",
                    message.senderId === "user1" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.senderId === "user1" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()} size="sm">
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
