

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, MoreVertical, Info } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  className?: string
  description?: string
  trend?: "up" | "down" | "stable"
  variant?: "default" | "success" | "warning" | "danger" | "info"
  onClick?: () => void
  isLoading?: boolean
  actions?: Array<{
    label: string
    onClick: () => void
    icon?: LucideIcon
  }>
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className, 
  description,
  trend,
  variant = "default",
  onClick,
  isLoading = false,
  actions = []
}: StatsCardProps) {
  const isPositive = trend === "up" || (change !== undefined && change > 0)
  const isNegative = trend === "down" || (change !== undefined && change < 0)
  const isNeutral = trend === "stable" || change === 0

  // Variant styles
  const variantConfig = {
    default: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      border: "border-border",
      valueColor: "text-foreground"
    },
    success: {
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      border: "border-green-200",
      valueColor: "text-green-700"
    },
    warning: {
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      valueColor: "text-amber-700"
    },
    danger: {
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
      border: "border-red-200",
      valueColor: "text-red-700"
    },
    info: {
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      valueColor: "text-blue-700"
    }
  }

  const currentVariant = variantConfig[variant]

  return (
    <Card 
      className={cn(
        "group transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        currentVariant.border,
        onClick && "cursor-pointer hover:bg-accent/5",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            currentVariant.iconBg
          )}>
            <Icon className={cn("h-6 w-6", currentVariant.iconColor)} />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Change Indicator */}
            {(change !== undefined || trend) && (
              <Badge 
                variant="outline" 
                className={cn(
                  "px-2 py-1 text-xs font-medium",
                  isPositive && "bg-green-50 text-green-700 border-green-200",
                  isNegative && "bg-red-50 text-red-700 border-red-200",
                  isNeutral && "bg-gray-50 text-gray-700 border-gray-200"
                )}
              >
                <div className="flex items-center gap-1">
                  {isPositive && <TrendingUp className="h-3 w-3" />}
                  {isNegative && <TrendingDown className="h-3 w-3" />}
                  {change !== undefined && (
                    <span>
                      {isPositive ? '+' : ''}{change}%
                    </span>
                  )}
                  {!change && trend && (
                    <span className="capitalize">{trend}</span>
                  )}
                </div>
              </Badge>
            )}

            {/* Info Tooltip */}
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent">
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm max-w-xs">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Actions Menu */}
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {actions.map((action, index) => (
                    <DropdownMenuItem 
                      key={index} 
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick()
                      }}
                      className="cursor-pointer"
                    >
                      {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Value */}
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-8 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
          ) : (
            <>
              <p className={cn(
                "text-3xl font-bold",
                currentVariant.valueColor
              )}>
                {value}
              </p>
              
              {/* Title */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{title}</p>
                
                {/* Additional Info */}
                {description && (
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {description}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Progress Bar (optional) */}
        {change !== undefined && !isNeutral && (
          <div className="mt-4">
            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-500",
                  isPositive ? "bg-green-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(Math.abs(change), 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for tight spaces
export function StatsCardCompact({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className,
  variant = "default"
}: Omit<StatsCardProps, 'description' | 'trend' | 'onClick' | 'actions'>) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0

  const variantConfig = {
    default: { iconBg: "bg-primary/10", iconColor: "text-primary" },
    success: { iconBg: "bg-green-500/10", iconColor: "text-green-600" },
    warning: { iconBg: "bg-amber-500/10", iconColor: "text-amber-600" },
    danger: { iconBg: "bg-red-500/10", iconColor: "text-red-600" },
    info: { iconBg: "bg-blue-500/10", iconColor: "text-blue-600" }
  }

  const currentVariant = variantConfig[variant]

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", currentVariant.iconBg)}>
            <Icon className={cn("h-5 w-5", currentVariant.iconColor)} />
          </div>
          <div>
            <p className="text-lg font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
        </div>
        
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive && "text-green-600",
            isNegative && "text-red-600"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </Card>
  )
}