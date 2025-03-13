import type { FeedItemType } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FeedItemListProps {
  items: FeedItemType[]
}

export function FeedItemList({ items }: FeedItemListProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[40%]">Description</TableHead>
            <TableHead className="w-[15%]">Date</TableHead>
            <TableHead className="w-[5%]">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell className="text-muted-foreground truncate max-w-xs">
                {item.description || "No description"}
              </TableCell>
              <TableCell>{formatDate(item.pubDate)}</TableCell>
              <TableCell>
                {item.link ? (
                  <Button asChild variant="ghost" size="icon">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open link</span>
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

