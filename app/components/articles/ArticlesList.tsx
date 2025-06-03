import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleService } from '../../lib/services/articleService';

interface Article {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
  };
  createdAt: string;
  tags?: string[];
}

interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

export function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await articleService.getArticles(currentPage);
      setArticles(data.articles);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
        <Link
          to="/articles/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Write Article
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article._id}
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
                {article.content.substring(0, 150)}...
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {article.author.username}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-200 text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 