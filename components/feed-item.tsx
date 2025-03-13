import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink } from "lucide-react"
import type { FeedItemType } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface FeedItemProps {
  item: FeedItemType
}

export function FeedItem({ item }: FeedItemProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{item.title}</CardTitle>
        {item.pubDate && (
          <CardDescription className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(item.pubDate)}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{item.description || "No description available"}</p>
      </CardContent>
      <CardFooter>
        {item.link && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <span>Read More</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

