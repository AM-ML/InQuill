"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Filter, Plus, Eye, Heart, MessageCircle, Edit, Trash2, MoreHorizontal, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../lib/contexts/AuthContext"
import { apiClient } from "../lib/utils/apiClient"

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

export default function MyArticlesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // State
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>("published")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalArticles, setTotalArticles] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [articleToDelete, setArticleToDelete] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  // Fetch articles with filters
  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      
      // Determine status filter based on active tab
      let statusFilter = activeTab;
      if (activeTab === "all") {
        statusFilter = "all";
      } else if (activeTab === "published") {
        statusFilter = "published";
      } else if (activeTab === "drafts") {
        statusFilter = "draft";
      }
      
      // API params
      const params: Record<string, string | number> = {
        page: currentPage,
        limit: 10,
        sort: sortBy,
      };
      
      // Add author filter if user is logged in
      if (user?._id) {
        params.authorId = user._id;
      }
      
      // Add status filter if not "all"
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }
      
      // Add search query if present
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add category filter if selected
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      const response = await apiClient.articles.getAll(params);
      
      setArticles(response.articles);
      setTotalPages(response.totalPages);
      setTotalArticles(response.totalArticles);
      
      // Extract unique categories if not already loaded
      if (categories.length === 0 && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchQuery, selectedCategory, sortBy, categories.length, toast, user?._id]);
  
  // Load articles on mount and when filters change
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);
  
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
  
  // Handle article deletion
  const handleDeleteArticle = useCallback(async () => {
    if (!articleToDelete) return;
    
    try {
      await apiClient.articles.delete(articleToDelete);
      
      // Update local state
      setArticles(prev => prev.filter(article => article._id !== articleToDelete));
      
      toast({
        title: "Article deleted",
        description: "The article has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
      });
    } finally {
      setArticleToDelete(null);
      setDeleteDialogOpen(false);
    }
  }, [articleToDelete, toast]);
  
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
          <p className="text-muted-foreground">Manage and track your published research articles</p>
        </div>
        <Link to="/dashboard/write">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Write New Article
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
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
        
        <TabsContent value={activeTab} className="space-y-4">
          {articles.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No articles found</h3>
                <p className="text-muted-foreground mt-2">
                  {searchQuery 
                    ? "No articles match your search criteria." 
                    : activeTab === "published" 
                      ? "You haven't published any articles yet."
                      : activeTab === "drafts" 
                        ? "You don't have any draft articles."
                        : "You haven't created any articles yet."}
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/dashboard/write')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Write New Article
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {articles.map((article) => (
                <Card key={article._id} className="overflow-hidden">
                  <div className="md:flex">
                    {article.coverImage && (
                      <div className="md:w-1/4">
                        <div className="h-48 md:h-full">
                          <img 
                            src={article.coverImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div className={`p-6 flex-1 ${!article.coverImage ? 'md:w-full' : 'md:w-3/4'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(article.status)}
                            {article.category && (
                              <Badge variant="outline">{article.category}</Badge>
                            )}
                          </div>
                          <Link className="hover:text-blue-600 dark:hover:text-blue-400" to={`/articles/${article._id}`}>
                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{article.title}</h3>
                          </Link>
                          {article.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/articles/${article._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/write?id=${article._id}`)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 dark:text-red-400"
                              onClick={() => {
                                setArticleToDelete(article._id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={article.author.avatar} alt={article.author.username} />
                            <AvatarFallback>{article.author.username.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{article.author.name || article.author.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {article.status.toLowerCase() === 'draft' 
                                ? `Last updated ${formatDate(article.updatedAt)}` 
                                : `Published ${formatDate(article.createdAt)}`}
                            </p>
                          </div>
                        </div>
                        
                        {article.status.toLowerCase() === 'published' && (
                          <div className="flex items-center space-x-4">
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
                        )}
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
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                
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
        </TabsContent>
      </Tabs>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your article
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteArticle}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 