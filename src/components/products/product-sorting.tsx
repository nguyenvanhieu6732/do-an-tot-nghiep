"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Grid3X3, LayoutGrid } from "lucide-react"

const sortOptions = [
  { id: "newest", label: "Mới nhất" },
  { id: "price-asc", label: "Giá: Thấp đến cao" },
  { id: "price-desc", label: "Giá: Cao đến thấp" },
  { id: "popular", label: "Phổ biến nhất" },
  { id: "rating", label: "Đánh giá cao nhất" },
]

export default function ProductSorting() {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0])
  const [gridView, setGridView] = useState("grid")

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground mr-2">Sắp xếp theo:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1">
              {selectedSort.label}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {sortOptions.map((option) => (
              <DropdownMenuItem key={option.id} onClick={() => setSelectedSort(option)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Hiển thị:</span>
        <Button
          variant={gridView === "grid" ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setGridView("grid")}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only">Grid view</span>
        </Button>
        <Button
          variant={gridView === "compact" ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setGridView("compact")}
        >
          <Grid3X3 className="h-4 w-4" />
          <span className="sr-only">Compact view</span>
        </Button>
      </div> */}
    </div>
  )
}

