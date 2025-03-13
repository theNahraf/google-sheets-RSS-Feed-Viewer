"use client"

import { useState } from "react"
import { RssFeed } from "@/components/rss-feed"
import { SheetSelector } from "@/components/sheet-selector"
import { SearchBar } from "@/components/search-bar"
import { SortOptions } from "@/components/sort-options"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { AutoRefreshToggle } from "@/components/auto-refresh-toggle"
import { RefreshIntervalSelector } from "@/components/refresh-interval-selector"

// Default spreadsheets configuration
const DEFAULT_SPREADSHEETS = [
  {
    name: "Main Spreadsheet",
    spreadsheetId: "1vSF7UAPWRsTMfExdZaDM9MBqUd_lq6TqbYYzNPKo_Rk",
    sheets: [
      { name: "Biomedical Alerts", sheetId: "1175542757" },
      { name: "Medical Innovation Alerts", sheetId: "704807287" },
      { name: "Medical Technology Alerts", sheetId: "769016024" },
    ],
  },
  // Add more spreadsheets as needed
  {
    name: "Secondary Spreadsheet",
    spreadsheetId: "1vSF7UAPWRsTMfExdZaDM9MBqUd_lq6TqbYYzNPKo_Rk", // Replace with actual ID
    sheets: [{ name: "Main Sheet", sheetId: "0" }],
  },
]

export function FeedDashboard() {
  // State for selected spreadsheet and sheet
  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState(DEFAULT_SPREADSHEETS[0])
  const [selectedSheet, setSelectedSheet] = useState(selectedSpreadsheet.sheets[0])

  // State for search query
  const [searchQuery, setSearchQuery] = useState("")

  // State for sort order
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "alphabetical">("newest")

  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // State for auto-refresh
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(60) // Default: 60 seconds

  // Handle spreadsheet change
  const handleSpreadsheetChange = (spreadsheetId: string) => {
    setIsLoading(true)
    const newSpreadsheet =
      DEFAULT_SPREADSHEETS.find((s) => s.spreadsheetId === spreadsheetId) || DEFAULT_SPREADSHEETS[0]
    setSelectedSpreadsheet(newSpreadsheet)
    setSelectedSheet(newSpreadsheet.sheets[0])
    setTimeout(() => setIsLoading(false), 500) // Simulate loading
  }

  // Handle sheet change
  const handleSheetChange = (sheetId: string) => {
    setIsLoading(true)
    const newSheet = selectedSpreadsheet.sheets.find((s) => s.sheetId === sheetId) || selectedSpreadsheet.sheets[0]
    setSelectedSheet(newSheet)
    setTimeout(() => setIsLoading(false), 500) // Simulate loading
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feed Settings</CardTitle>
          <CardDescription>Select a spreadsheet, sheet, and configure display options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Spreadsheet</h3>
              <SheetSelector
                options={DEFAULT_SPREADSHEETS.map((s) => ({ label: s.name, value: s.spreadsheetId }))}
                value={selectedSpreadsheet.spreadsheetId}
                onChange={handleSpreadsheetChange}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sheet</h3>
              <SheetSelector
                options={selectedSpreadsheet.sheets.map((s) => ({ label: s.name, value: s.sheetId }))}
                value={selectedSheet.sheetId}
                onChange={handleSheetChange}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Sort By</h3>
              <SortOptions value={sortOrder} onChange={setSortOrder} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Search</h3>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium mb-4">Auto-Refresh Settings</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <AutoRefreshToggle enabled={autoRefresh} onToggle={setAutoRefresh} />
              </div>
              <div className="space-y-2">
                <RefreshIntervalSelector
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  disabled={!autoRefresh}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <div className="text-sm text-muted-foreground">
            Viewing: {selectedSpreadsheet.name} / {selectedSheet.name}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading feed data...</span>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-0">
              <RssFeed
                spreadsheetId={selectedSpreadsheet.spreadsheetId}
                sheetId={selectedSheet.sheetId}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
                viewType="grid"
                autoRefresh={autoRefresh}
                refreshInterval={refreshInterval}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <RssFeed
                spreadsheetId={selectedSpreadsheet.spreadsheetId}
                sheetId={selectedSheet.sheetId}
                searchQuery={searchQuery}
                sortOrder={sortOrder}
                viewType="list"
                autoRefresh={autoRefresh}
                refreshInterval={refreshInterval}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

