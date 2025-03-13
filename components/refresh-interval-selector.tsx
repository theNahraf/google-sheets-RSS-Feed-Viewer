"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RefreshIntervalSelectorProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function RefreshIntervalSelector({ value, onChange, disabled = false }: RefreshIntervalSelectorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="refresh-interval" className="text-sm font-medium">
        Refresh Interval
      </label>
      <Select value={value.toString()} onValueChange={(val) => onChange(Number.parseInt(val))} disabled={disabled}>
        <SelectTrigger id="refresh-interval" className="w-full">
          <SelectValue placeholder="Select interval..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">Every 10 seconds</SelectItem>
          <SelectItem value="30">Every 30 seconds</SelectItem>
          <SelectItem value="60">Every minute</SelectItem>
          <SelectItem value="300">Every 5 minutes</SelectItem>
          <SelectItem value="600">Every 10 minutes</SelectItem>
          <SelectItem value="1800">Every 30 minutes</SelectItem>
          <SelectItem value="3600">Every hour</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

