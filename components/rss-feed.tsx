"use client"

import { useEffect, useState, useRef } from "react"
import { FeedItem } from "@/components/feed-item"
import { FeedItemList } from "@/components/feed-item-list"
import { RefreshButton } from "@/components/refresh-button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Clock } from "lucide-react"
import type { FeedItemType } from "@/lib/types"
import { getRssFeedFromSheet } from "@/lib/google-sheets"
import { formatDistanceToNow } from "@/lib/utils"

interface RssFeedProps {
  spreadsheetId: string
  sheetId: string
  searchQuery: string
  sortOrder: "newest" | "oldest" | "alphabetical"
  viewType: "grid" | "list"
  autoRefresh: boolean
  refreshInterval: number
}

export function RssFeed({
  spreadsheetId,
  sheetId,
  searchQuery,
  sortOrder,
  viewType,
  autoRefresh,
  refreshInterval,
}: RssFeedProps) {
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  // Use a ref to track the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch feed items
  const fetchFeed = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setIsAutoRefreshing(true)
    } else {
      setIsLoading(true)
    }

    setError(null)

    try {
      const items = await getRssFeedFromSheet(spreadsheetId, sheetId)
      setFeedItems(items)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to load feed data. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsAutoRefreshing(false)
    }
  }

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchFeed()

    // Setup auto-refresh interval
    if (autoRefresh && refreshInterval > 0) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Set new interval
      intervalRef.current = setInterval(() => {
        fetchFeed(true)
      }, refreshInterval * 1000)
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [spreadsheetId, sheetId, autoRefresh, refreshInterval])

  // Filter items based on search query
  const filteredItems = feedItems.filter((item) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      item.title.toLowerCase().includes(query) || (item.description && item.description.toLowerCase().includes(query))
    )
  })

  // Sort items based on sort order
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "alphabetical") {
      return a.title.localeCompare(b.title)
    } else if (sortOrder === "newest") {
      const dateA = a.pubDate ? a.pubDate.getTime() : 0
      const dateB = b.pubDate ? b.pubDate.getTime() : 0
      return dateB - dateA // Newest first
    } else {
      const dateA = a.pubDate ? a.pubDate.getTime() : 0
      const dateB = b.pubDate ? b.pubDate.getTime() : 0
      return dateA - dateB // Oldest first
    }
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h2 className="text-xl font-semibold">
          Feed Items ({sortedItems.length}){searchQuery && ` • Search: "${searchQuery}"`}
        </h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Updated {formatDistanceToNow(lastUpdated)}
                {isAutoRefreshing && " • Refreshing..."}
              </span>
            </div>
          )}
          <RefreshButton onRefresh={() => fetchFeed()} isLoading={isLoading} />
        </div>
      </div>

      {sortedItems.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">{searchQuery ? "No matching items found" : "No feed items found"}</p>
        </div>
      ) : viewType === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedItems.map((item, index) => (
            <FeedItem key={index} item={item} />
          ))}
        </div>
      ) : (
        <FeedItemList items={sortedItems} />
      )}
    </div>
  )
}

