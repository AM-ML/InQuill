const API_URL = 'http://localhost:3000/api';

export const articleService = {
  // Get all articles with pagination
  async getArticles(page = 1, limit = 10) {
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

  // Get single article by ID
  async getArticleById(id) {
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

  // Create new article
  async createArticle(articleData) {
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

  // Update article
  async updateArticle(id, articleData) {
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

  // Delete article (admin only)
  async deleteArticle(id) {
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