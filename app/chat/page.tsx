"use client"

import { useState, useEffect, useRef } from "react"
import { mockConversations, mockMessages, mockHosts, mockUsers } from "@/lib/mock-data"
import type { Conversation, Message, Host, User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SendIcon, PaperclipIcon, ImageIcon, MoreVerticalIcon, ArrowLeftIcon } from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-select first conversation on desktop
  useEffect(() => {
    if (!isMobile && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0])
    }
  }, [conversations, isMobile, selectedConversation])

  const getOtherParticipant = (conversation: Conversation): Host | User | null => {
    const currentUserId = "user1" // Mock current user
    const otherParticipantId = conversation.participants.find((id) => id !== currentUserId)

    if (!otherParticipantId) return null

    // Try to find in hosts first, then users
    return (
      mockHosts.find((h) => h.id === otherParticipantId) || mockUsers.find((u) => u.id === otherParticipantId) || null
    )
  }

  const getConversationMessages = (conversationId: string) => {
    return messages.filter((m) => m.conversationId === conversationId)
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: "user1",
      content: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate typing indicator and response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)

      // Simulate host response
      const responses = [
        "¡Perfecto! Me parece genial. ¿Hay algo específico que deba saber sobre tu mascota?",
        "Claro, estaré encantado de ayudarte. ¿Cuándo necesitarías el servicio?",
        "Gracias por contactarme. Te envío más información por privado.",
        "Me alegra saber de ti. ¿Podríamos programar una videollamada para conocernos mejor?",
      ]

      const response: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: selectedConversation.id,
        senderId: selectedConversation.participants.find((id) => id !== "user1") || "",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(Date.now() + 2000),
        read: false,
      }

      setMessages((prev) => [...prev, response])
    }, 2000)
  }

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, "HH:mm")
    } else if (isYesterday(timestamp)) {
      return "Ayer"
    } else {
      return format(timestamp, "dd/MM", { locale: es })
    }
  }

  const formatLastMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, "HH:mm")
    } else if (isYesterday(timestamp)) {
      return "Ayer"
    } else {
      return format(timestamp, "dd MMM", { locale: es })
    }
  }

  if (isMobile && selectedConversation) {
    // Mobile: Show only chat view
    const otherParticipant = getOtherParticipant(selectedConversation)
    const conversationMessages = getConversationMessages(selectedConversation.id)

    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Mobile Chat Header */}
        <div className="border-b bg-card p-4 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setSelectedConversation(null)}>
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>

          {otherParticipant && (
            <>
              <Avatar className="w-10 h-10">
                <AvatarImage src={otherParticipant.avatar || "/placeholder.svg"} alt={otherParticipant.name} />
                <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h3 className="font-semibold">{otherParticipant.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {"location" in otherParticipant ? otherParticipant.location.city : "Usuario"}
                </p>
              </div>
            </>
          )}

          <Button variant="ghost" size="sm">
            <MoreVerticalIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversationMessages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", message.senderId === "user1" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2",
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
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
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
        <div className="border-t bg-card p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <PaperclipIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <SendIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mensajes</h1>
              <p className="text-muted-foreground">Conversa con hospedadores</p>
            </div>

            <Link href="/dashboard">
              <Button variant="outline">Volver al dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Conversations List */}
        <div className={cn("border-r bg-card/50", isMobile ? "w-full" : "w-80")}>
          <div className="p-4">
            <h2 className="font-semibold mb-4">Conversaciones</h2>

            {conversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">💬</div>
                <h3 className="font-semibold mb-2">No hay conversaciones</h3>
                <p className="text-sm text-muted-foreground">Cuando contactes con hospedadores, aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => {
                  const otherParticipant = getOtherParticipant(conversation)
                  const lastMessage = conversation.lastMessage
                  const unreadCount = getConversationMessages(conversation.id).filter(
                    (m) => !m.read && m.senderId !== "user1",
                  ).length

                  if (!otherParticipant) return null

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={cn(
                        "w-full p-3 rounded-lg text-left hover:bg-muted/50 transition-colors",
                        selectedConversation?.id === conversation.id && "bg-muted",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={otherParticipant.avatar || "/placeholder.svg"}
                            alt={otherParticipant.name}
                          />
                          <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium truncate">{otherParticipant.name}</h3>
                            {lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {formatLastMessageTime(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground truncate">
                            {"location" in otherParticipant ? otherParticipant.location.city : "Usuario"}
                          </p>

                          {lastMessage && (
                            <p className="text-sm text-muted-foreground truncate mt-1">{lastMessage.content}</p>
                          )}
                        </div>

                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const otherParticipant = getOtherParticipant(selectedConversation)
                      return otherParticipant ? (
                        <>
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={otherParticipant.avatar || "/placeholder.svg"}
                              alt={otherParticipant.name}
                            />
                            <AvatarFallback>{otherParticipant.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="font-semibold">{otherParticipant.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {"location" in otherParticipant ? otherParticipant.location.city : "Usuario"}
                            </p>
                          </div>
                        </>
                      ) : null
                    })()}
                  </div>

                  <Button variant="ghost" size="sm">
                    <MoreVerticalIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getConversationMessages(selectedConversation.id).map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex", message.senderId === "user1" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2",
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
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-2xl px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
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
              <div className="border-t bg-card p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <PaperclipIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Selecciona una conversación</h3>
                <p className="text-muted-foreground">Elige una conversación de la lista para comenzar a chatear.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
