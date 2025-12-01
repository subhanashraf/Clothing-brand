"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Bell } from "lucide-react"
import type { User } from "@/lib/types"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  user: User | null
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-foreground">Welcome back, {user?.name?.split(" ")[0] || "User"}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
