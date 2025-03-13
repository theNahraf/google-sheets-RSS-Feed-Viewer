"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SortOptionsProps {
  value: "newest" | "oldest" | "alphabetical"
  onChange: (value: "newest" | "oldest" | "alphabetical") => void
}

export function SortOptions({ value, onChange }: SortOptionsProps) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as "newest" | "oldest" | "alphabetical")}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="oldest">Oldest First</SelectItem>
        <SelectItem value="alphabetical">Alphabetical</SelectItem>
      </SelectContent>
    </Select>
  )
}

