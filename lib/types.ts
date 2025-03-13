export interface FeedItemType {
  title: string
  description: string
  link: string
  pubDate: Date | null
}

export interface SpreadsheetConfig {
  name: string
  spreadsheetId: string
  sheets: SheetConfig[]
}

export interface SheetConfig {
  name: string
  sheetId: string
}

