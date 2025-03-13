import type { FeedItemType } from "@/lib/types"

export async function getRssFeedFromSheet(spreadsheetId: string, sheetId: string): Promise<FeedItemType[]> {
  try {
    // Construct the Google Sheets CSV export URL
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${sheetId}`

    // Fetch the CSV data
    const response = await fetch(csvUrl, { cache: "no-store" }) // Don't cache to always get fresh data

    if (!response.ok) {
      throw new Error(`Failed to fetch spreadsheet: ${response.statusText}`)
    }

    const csvText = await response.text()

    // Parse CSV to get feed items
    return parseCSVToFeedItems(csvText)
  } catch (error) {
    console.error("Error fetching Google Sheet data:", error)
    return []
  }
}

function parseCSVToFeedItems(csvText: string): FeedItemType[] {
  // Split the CSV into rows
  const rows = csvText.split("\n")

  if (rows.length <= 1) {
    return []
  }

  // Get the header row to determine column indices
  const headers = parseCSVRow(rows[0])

  // Find the indices of relevant columns
  const titleIndex = headers.findIndex((h) => h.toLowerCase().includes("title"))
  const descriptionIndex = headers.findIndex((h) => h.toLowerCase().includes("description"))
  const linkIndex = headers.findIndex((h) => h.toLowerCase().includes("link"))
  const dateIndex = headers.findIndex((h) => h.toLowerCase().includes("date"))

  // Parse each data row into a feed item
  const feedItems: FeedItemType[] = []

  for (let i = 1; i < rows.length; i++) {
    if (!rows[i].trim()) continue

    const columns = parseCSVRow(rows[i])

    // Skip rows that don't have enough columns
    if (columns.length <= Math.max(titleIndex, descriptionIndex, linkIndex, dateIndex)) {
      continue
    }

    const title = titleIndex >= 0 ? columns[titleIndex] : ""

    // Skip rows without a title
    if (!title) continue

    feedItems.push({
      title,
      description: descriptionIndex >= 0 ? columns[descriptionIndex] : "",
      link: linkIndex >= 0 ? columns[linkIndex] : "",
      pubDate: dateIndex >= 0 ? new Date(columns[dateIndex]) : new Date(), // Default to current date if not provided
    })
  }

  return feedItems
}

function parseCSVRow(row: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  result.push(current)
  return result
}

