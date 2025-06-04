import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThemeProvider } from "../components/theme-provider";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { articleService } from "../lib/services/articleService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{name: string, count: number}[]>([]);
  const [popularTags, setPopularTags] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        
        // Get first page of articles to extract categories and tags
        const response = await articleService.getArticles({ limit: 1 });
        
        if (response.categories) {
          // Map categories to the expected format
          const formattedCategories = response.categories.map((cat: string) => ({
            name: cat,
            count: 0 // We don't have count data, so defaulting to 0
          }));
          setCategories(formattedCategories);
        }
        
        if (response.popularTags) {
          setPopularTags(response.popularTags);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Generate gradient colors for categories
  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-600 to-blue-400",
      "from-purple-600 to-purple-400",
      "from-green-600 to-green-400",
      "from-red-600 to-red-400",
      "from-yellow-600 to-yellow-400",
      "from-indigo-600 to-indigo-400",
      "from-pink-600 to-pink-400",
      "from-teal-600 to-teal-400"
    ];
    
    return gradients[index % gradients.length];
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-16">
            <div className="container px-4 md:px-6">
              <motion.div
                className="max-w-3xl mx-auto text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Categories</h1>
                <p className="text-muted-foreground md:text-xl">
                  Explore articles by topic and interest
                </p>
              </motion.div>
            </div>
          </div>

          <div className="container px-4 md:px-6 py-8">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-8 text-red-500">{error}</div>
            ) : (
              <>
                {/* Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <motion.div
                          key={category.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          whileHover={{ y: -5 }}
                        >
                          <Link to={`/articles?category=${encodeURIComponent(category.name)}`}>
                            <Card className="h-40 overflow-hidden hover:shadow-md transition-all">
                              <CardContent className="p-0 h-full">
                                <div className={`h-full flex items-center justify-center bg-gradient-to-r ${getGradient(index)}`}>
                                  <div className="text-center text-white p-6">
                                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                    {category.count > 0 && (
                                      <p className="text-sm opacity-90">{category.count} articles</p>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center p-8 text-gray-500">No categories found</div>
                    )}
                  </div>
                </motion.div>

                {/* Popular Tags */}
                {popularTags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Popular Tags</h2>
                    <div className="flex flex-wrap gap-3">
                      {popularTags.map((tag, index) => (
                        <motion.div
                          key={tag.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.4 }}
                        >
                          <Link to={`/articles?tags=${encodeURIComponent(tag.name)}`}>
                            <Badge 
                              variant="secondary" 
                              className="text-sm py-2 px-4 hover:bg-muted cursor-pointer"
                            >
                              {tag.name} {tag.count > 0 && <span className="ml-1 text-xs opacity-70">({tag.count})</span>}
                            </Badge>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
} 