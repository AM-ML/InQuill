"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const showMaxPages = 5 // Maximum number of page buttons to show
    
    if (totalPages <= showMaxPages) {
      // Show all pages if total is less than or equal to max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage <= 3) {
        // If near beginning, show first few pages
        pages.push(2, 3, 4)
        pages.push('...')
      } else if (currentPage >= totalPages - 2) {
        // If near end, show last few pages
        pages.push('...')
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1)
      } else {
        // Otherwise show current page and neighbors
        pages.push('...')
        pages.push(currentPage - 1, currentPage, currentPage + 1)
        pages.push('...')
      }
      
      // Always show last page
      pages.push(totalPages)
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <nav className="flex justify-center items-center mt-8 space-x-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>
      
      {pageNumbers.map((page, i) => (
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-1">...</span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => typeof page === 'number' && onPageChange(page)}
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </nav>
  )
} 