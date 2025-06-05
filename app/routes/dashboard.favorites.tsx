"use client"

import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Eye, Heart, MessageCircle, Bookmark, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../lib/contexts/AuthContext"
import { articleService } from "../lib/services/articleService"
import { API_URL } from "../lib/constants"

interface Article {
  _id: string
  title: string
  description?: string
  status: string
  category?: string
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  comments: number[]
  coverImage?: string
  author: {
    _id: string
    username: string
    name?: string
    title?: string
    avatar?: string
  }
}

export default function BookmarksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // State
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  // Fetch bookmarked articles
  const fetchBookmarkedArticles = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Use the dedicated favorites endpoint directly instead of using favoritesOnly parameter
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        limit: 10,
        sort: sortBy
      };
      
      // Add search query if present
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add category filter if selected
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      // Call the favorites endpoint directly
      const response = await fetch(
        `${API_URL}/articles/favorites?${new URLSearchParams(params as any).toString()}`,
        {
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked articles');
      }
      
      const data = await response.json();
      
      setArticles(data.articles as any);
      setTotalPages(data.totalPages || 1);
      setTotalArticles(data.totalArticles || data.articles.length);
      
      // Extract unique categories if not already loaded
      if (categories.length === 0 && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching bookmarked articles:", error);
      toast({
        title: "Error",
        description: "Failed to load bookmarked articles. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedCategory, sortBy, categories.length, toast, user]);
  
  // Load articles on mount and when filters change
  useEffect(() => {
    fetchBookmarkedArticles();
  }, [fetchBookmarkedArticles]);
  
  // Handle search input
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);
  
  // Handle sort change
  const handleSortChange = useCallback((value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page on sort change
  }, []);
  
  // Handle category filter change
  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1); // Reset to first page on category change
  }, []);
  
  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Format numbers with proper suffixes (e.g. 1.2K)
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Published</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  // Display a loading state while fetching data
  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarked Articles</h1>
          <p className="text-muted-foreground">Articles you've saved for later reference</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bookmarks..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Views</SelectItem>
              <SelectItem value="trending">Most Likes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {articles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center h-full">
              <Bookmark className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No bookmarks found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery 
                  ? "No bookmarked articles match your search criteria." 
                  : "You haven't saved any articles yet."}
              </p>
              <Link to="/articles">
                <Button className="mt-4">
                  Browse Articles
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden">
                <div className="md:flex w-full">
                  {article.coverImage && (
                    <div className="md:w-1/4 flex-shrink-0">
                      <div className="h-48 md:h-full">
                        <img 
                          src={article.coverImage} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`p-6 flex-1 min-w-0 ${!article.coverImage ? 'md:w-full' : 'md:w-3/4'}`}>
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {getStatusBadge(article.status)}
                          {article.category && (
                            <Badge variant="outline">{article.category}</Badge>
                          )}
                        </div>
                        <Link className="hover:text-blue-600 dark:hover:text-blue-400 block" to={`/articles/${article._id}`}>
                          <h3 className="text-xl font-bold mb-2 line-clamp-1">{article.title}</h3>
                        </Link>
                        {article.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-yellow-500 flex-shrink-0"
                        onClick={() => {
                          articleService.favoriteArticle(article._id)
                            .then(() => {
                              // Remove from UI immediately
                              setArticles(prev => prev.filter(a => a._id !== article._id));
                              toast({
                                title: "Removed from bookmarks",
                                description: "Article has been removed from your bookmarks",
                              });
                            })
                            .catch(error => {
                              console.error("Error removing bookmark:", error);
                              toast({
                                title: "Error",
                                description: "Failed to remove from bookmarks"
                              });
                            });
                        }}
                      >
                        <Bookmark className="h-5 w-5 fill-current" />
                        <span className="sr-only">Remove from bookmarks</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 flex-wrap gap-y-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                          <AvatarImage src={article.author.avatar} alt={article.author.username} />
                          <AvatarFallback>{article.author.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{article.author.name || article.author.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 flex-wrap">
                        <div className="flex items-center text-muted-foreground">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatNumber(article.views)}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatNumber(article.likes)}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span className="text-sm">{formatNumber(article.comments.length)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              {(() => {
                const pages = [];
                const maxVisiblePages = 5;
                
                // Always show first page
                if (totalPages > 0) {
                  pages.push(
                    <Button
                      key={1}
                      variant={currentPage === 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(1)}
                    >
                      1
                    </Button>
                  );
                }
                
                // Add ellipsis after first page if needed
                if (currentPage > 3) {
                  pages.push(
                    <span key="ellipsis-start" className="px-2">
                      ...
                    </span>
                  );
                }
                
                // Calculate range of visible pages
                let startPage = Math.max(2, currentPage - 1);
                let endPage = Math.min(totalPages - 1, currentPage + 1);
                
                // Adjust range if at edges
                if (currentPage <= 3) {
                  endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
                } else if (currentPage >= totalPages - 2) {
                  startPage = Math.max(2, totalPages - maxVisiblePages + 2);
                }
                
                // Add visible pages
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                    >
                      {i}
                    </Button>
                  );
                }
                
                // Add ellipsis before last page if needed
                if (currentPage < totalPages - 2) {
                  pages.push(
                    <span key="ellipsis-end" className="px-2">
                      ...
                    </span>
                  );
                }
                
                // Always show last page if there is more than one page
                if (totalPages > 1) {
                  pages.push(
                    <Button
                      key={totalPages}
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  );
                }
                
                return pages;
              })()}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 