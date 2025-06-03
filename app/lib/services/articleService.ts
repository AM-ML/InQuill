import { API_URL } from '../constants';

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

interface ArticleInput {
  title: string;
  content: string;
  status?: 'draft' | 'published';
  tags?: string[];
}

interface ArticlesResponse {
  articles: Article[];
  totalPages: number;
  currentPage: number;
}

export const articleService = {
  async getArticles(page = 1, limit = 10): Promise<ArticlesResponse> {
    const response = await fetch(
      `${API_URL}/articles?page=${page}&limit=${limit}`,
      {
        credentials: 'include'
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch articles');
    }
    return response.json();
  },

  async getArticleById(id: string): Promise<Article> {
    const response = await fetch(
      `${API_URL}/articles/${id}`,
      {
        credentials: 'include'
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch article');
    }
    return response.json();
  },

  async createArticle(articleData: ArticleInput): Promise<Article> {
    const response = await fetch(
      `${API_URL}/articles`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(articleData)
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create article');
    }
    return response.json();
  },

  async updateArticle(id: string, articleData: ArticleInput): Promise<Article> {
    const response = await fetch(
      `${API_URL}/articles/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(articleData)
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update article');
    }
    return response.json();
  },

  async deleteArticle(id: string): Promise<{ message: string }> {
    const response = await fetch(
      `${API_URL}/articles/${id}`,
      {
        method: 'DELETE',
        credentials: 'include'
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete article');
    }
    return response.json();
  }
}; 