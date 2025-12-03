import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  phone: string
  message?: string
  className?: string
}

export function WhatsAppButton({ phone, message = "Hello!", className }: WhatsAppButtonProps) {
  const formattedPhone = phone.replace(/\D/g, "")
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`

  return (
    <Button
      asChild
      className={cn(
        "bg-[#25D366] hover:bg-[#128C7E] text-white",
        className
      )}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp Inquiry
      </a>
    </Button>
  )
}