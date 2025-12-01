"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, LogOut, ChevronLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DashboardSidebarProps {
  user: User | null
}

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
                <span className="text-sidebar-primary-foreground font-bold text-sm">P</span>
              </div>
              {!isCollapsed && <span className="font-semibold text-sidebar-foreground">Premium</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className={cn("flex items-center gap-3 mb-3", isCollapsed && "justify-center")}>
              <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center shrink-0">
                <span className="text-sm font-medium text-sidebar-accent-foreground">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name || "User"}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                isCollapsed && "justify-center px-0",
              )}
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sign out</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
