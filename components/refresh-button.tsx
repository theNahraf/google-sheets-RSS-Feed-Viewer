"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onRefresh: () => void
  isLoading?: boolean
}

export function RefreshButton({ onRefresh, isLoading = false }: RefreshButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading} className="flex items-center gap-2">
      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>Refresh</span>
    </Button>
  )
}

