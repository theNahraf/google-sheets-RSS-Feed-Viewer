"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AutoRefreshToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export function AutoRefreshToggle({ enabled, onToggle }: AutoRefreshToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="auto-refresh" checked={enabled} onCheckedChange={onToggle} />
      <Label htmlFor="auto-refresh" className="cursor-pointer">
        Auto-refresh feed
      </Label>
    </div>
  )
}

