import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { ThemeProvider } from "../components/theme-provider";
import ArticleCard from "../components/article-card";
import Pagination from "../components/pagination";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { articleService } from "../lib/services/articleService";
import { useSearchParams, useLocation } from "react-router-dom";

// Medical categories
const MEDICAL_CATEGORIES = [
  "Neurology", "Cardiology", "Pulmonology", "Genetics", "Infectious Disease",
  "Immunology", "Rheumatology", "Endocrinology", "Oncology", "Pediatrics",
  "Psychiatry", "Hematology", "Internal Medicine", "Nephrology", 
  "Transplant Medicine", "Gastroenterology", "Dermatology", 
  "Obstetrics & Gynecology", "Surgery", "Ophthalmology", "Otolaryngology", 
  "Dentistry", "Orthopedics", "Public Health", "Medical Technology"
];

// Article type definition
interface Article {
  _id: string;
  title: string;
  description?: string;
  content: any;
  author: {
    _id: string;
    username: string;
    name?: string;
    title?: string;
    avatar?: string;
  };
  category?: string;
  coverImage?: string;
  createdAt: string;
  likes?: number;
  views?: number;
  tags?: string[];
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<string[]>(MEDICAL_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get URL search parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Initialize search query from URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setDebouncedSearchQuery(searchFromUrl);
    }
    
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
    
    const sortFromUrl = searchParams.get("sort");
    if (sortFromUrl) {
      setSortBy(sortFromUrl);
    }
  }, [location.search]); // Only run when URL search params change

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      
      // Update URL with search query
      if (searchQuery) {
        searchParams.set("search", searchQuery);
      } else {
        searchParams.delete("search");
      }
      setSearchParams(searchParams);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch articles based on filters
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
          sort: sortBy,
          search: debouncedSearchQuery,
          category: category !== "all" ? category : ""
        };

        const response = await articleService.getArticles(params);
        setArticles(response.articles);
        setTotalPages(response.totalPages);
        
        // Use predefined medical categories instead of dynamic ones
        // If there are additional categories from the API, we can merge them
        if (response.categories) {
          const allCategories = [...new Set([
            ...MEDICAL_CATEGORIES, 
            ...response.categories.filter(cat => cat) // Filter out empty categories
          ])];
          setCategories(allCategories);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentPage, debouncedSearchQuery, category, sortBy]);

  // Handle search with debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // We don't reset the page here since the actual search is debounced
  };

  // Reset to first page when search query is actually applied
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, category, sortBy]);

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    
    // Update URL with category
    if (value && value !== "all") {
      searchParams.set("category", value);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    // Update URL with sort
    if (value && value !== "newest") {
      searchParams.set("sort", value);
    } else {
      searchParams.delete("sort");
    }
    setSearchParams(searchParams);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
            <div className="container px-4 md:px-6">
              <motion.div
                className="max-w-3xl mx-auto text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Articles</h1>
                <p className="text-muted-foreground md:text-xl">
                  Explore the latest medical research and insights
                </p>
              </motion.div>
            </div>
          </div>

          <div className="container px-4 md:px-6 py-8">
            <motion.div
              className="flex flex-col md:flex-row gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles by title, author, category, or keywords..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Medical Specialty" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[400px]">
                    <SelectItem value="all">All Specialties</SelectItem>
                    {categories.sort().map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="hidden sm:flex">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </div>
            </motion.div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">{error}</div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  {debouncedSearchQuery ? 
                    `No results for "${debouncedSearchQuery}"${category !== 'all' ? ` in ${category}` : ''}` : 
                    category !== 'all' ? `No articles in ${category} yet` : 'No articles available'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article, index) => (
                  <ArticleCard key={article._id} article={article} index={index} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
} 