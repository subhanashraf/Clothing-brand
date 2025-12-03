import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailButtonProps {
  email: string
  subject?: string
  body?: string
  className?: string
}

export function EmailButton({ 
  email, 
  subject = "Product Inquiry", 
  body = "Hello, I'm interested in your product.",
  className 
}: EmailButtonProps) {
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <Button
      asChild
      variant="outline"
      className={cn("border-blue-500 text-blue-600 hover:bg-blue-50", className)}
    >
      <a href={mailtoUrl}>
        <Mail className="mr-2 h-4 w-4" />
        Email Inquiry
      </a>
    </Button>
  )
}