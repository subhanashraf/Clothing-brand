"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, change, icon: Icon, className }: StatsCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className={cn("glass", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                isPositive && "text-chart-4",
                isNegative && "text-destructive",
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
