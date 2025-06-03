import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articleService } from '../../lib/services/articleService';
import { useAuth } from '../../lib/contexts/AuthContext';

interface Article {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  status: 'draft' | 'published';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await articleService.getArticleById(id);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      setLoading(true);
      await articleService.deleteArticle(id);
      navigate('/articles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          Article not found
        </div>
      </div>
    );
  }

  const canEdit = user && (user.role === 'admin' || user._id === article.author._id);
  const canDelete = user && user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        {(canEdit || canDelete) && (
          <div className="flex space-x-4">
            {canEdit && (
              <button
                onClick={() => navigate(`/articles/edit/${id}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 flex items-center text-gray-600">
        <span>By {article.author.username}</span>
        <span className="mx-2">•</span>
        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        {article.status === 'draft' && (
          <>
            <span className="mx-2">•</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
              Draft
            </span>
          </>
        )}
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        {article.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
} 