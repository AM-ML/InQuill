import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../lib/services/articleService';
import { Search, Filter, X } from 'lucide-react';
// @ts-ignore
import debounce from 'lodash/debounce';

interface Article {
  _id: string;
  title: string;
  description?: string;
  content: string;
  author: {
    username: string;
    title?: string;
  };
  createdAt: string;
  tags?: string[];
  likes?: number;
  category?: string;
}

interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
  categories?: string[];
  popularTags?: { name: string; count: number }[];
}

export function ArticlesList() {
  // State
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<{ name: string; count: number }[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  
  // Refs
  const observer = useRef<IntersectionObserver | null>(null);
  const lastArticleElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreArticles();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Initial data load
  useEffect(() => {
    fetchArticles(true);
  }, [searchTerm, selectedCategory, sortBy, selectedTags]);
  
  // Debounced search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedTags([]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const fetchArticles = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      // Build query parameters
      const params: Record<string, string | number> = {
        page: reset ? 1 : currentPage,
        limit: 6,
        sort: sortBy
      };
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }
      
      const data: ArticlesResponse = await articleService.getArticles(params);
      
      if (reset) {
        setArticles(data.articles);
        if (data.categories) {
          setCategories(data.categories);
        }
        if (data.popularTags) {
          setPopularTags(data.popularTags);
        }
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
      
      setTotalPages(data.totalPages);
      setHasMore(data.currentPage < data.totalPages);
      
      if (reset) {
        setCurrentPage(1);
      } else {
        setCurrentPage(prev => prev + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreArticles = () => {
    if (currentPage < totalPages) {
      fetchArticles();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          
          {/* Category filter */}
          <div className="w-full md:w-1/4">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort by */}
          <div className="w-full md:w-1/4">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
            </select>
          </div>
        </div>
        
        {/* Tags */}
        {popularTags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Popular Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.name)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Active filters */}
        {(searchTerm || selectedCategory || selectedTags.length > 0 || sortBy !== 'newest') && (
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>Search: {searchTerm}</span>
                  <button onClick={() => debouncedSearch('')} className="text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedCategory && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('')} className="text-gray-500 hover:text-gray-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {sortBy !== 'newest' && (
                <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span>Sorted by: {sortBy}</span>
                </div>
              )}
            </div>
            
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4 min-h-[300px] flex items-center justify-center">
          Error: {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center text-gray-500 p-4 min-h-[300px] flex items-center justify-center">
          No articles found. Try adjusting your filters.
        </div>
      ) : (
        <div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => {
              const isLastElement = index === articles.length - 1;
              return (
                <div
                  key={article._id}
                  ref={isLastElement ? lastArticleElementRef : null}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">
                      <Link
                        to={`/articles/${article._id}`}
                        className="text-gray-900 hover:text-indigo-600"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {article.description || "No description available"}...
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        By {article.author.name || article.author.username}
                        {article.author.title && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {article.author.title}
                          </span>
                        )}
                      </span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {article.category && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
                          {article.category}
                        </span>
                      )}
                      {article.likes !== undefined && (
                        <span className="text-xs text-gray-500">
                          {article.likes} {article.likes === 1 ? 'like' : 'likes'}
                        </span>
                      )}
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 