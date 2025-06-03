// API client for making requests to the backend

// Define the base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Function to check if auth token needs to be refreshed
const checkTokenRefresh = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get token expiry from localStorage
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return;
    
    // If token expires in less than 5 minutes, refresh it
    const expiryTime = parseInt(tokenExpiry, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (expiryTime - currentTime < 300) { // 5 minutes in seconds
      await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }
};

// API client with methods for different operations
export const apiClient = {
  // Generic request method with auth handling
  async request(endpoint: string, options: RequestInit = {}) {
    await checkTokenRefresh();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    
    const config = {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle 401 Unauthorized errors - could redirect to login
      if (response.status === 401) {
        // Optional: Redirect to login page or trigger auth workflow
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
      }
      
      // Handle 403 Forbidden errors
      if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to access this resource');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },
  
  // GET request
  async get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },
  
  // POST request
  async post(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // PUT request
  async put(endpoint: string, data: any, options: RequestInit = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE request
  async delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
  
  // Upload file (multipart/form-data)
  async uploadFile(endpoint: string, formData: FormData, options: RequestInit = {}) {
    await checkTokenRefresh();
    
    const config = {
      ...options,
      method: 'POST',
      body: formData,
      credentials: 'include' as RequestCredentials,
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },
  
  // Specific API methods
  
  // Articles
  articles: {
    getAll(params: Record<string, string | number> = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      return apiClient.get(`/articles?${queryParams.toString()}`);
    },
    
    getById(id: string) {
      return apiClient.get(`/articles/${id}`);
    },
    
    create(articleData: any) {
      return apiClient.post('/articles', articleData);
    },
    
    update(id: string, articleData: any) {
      return apiClient.put(`/articles/${id}`, articleData);
    },
    
    delete(id: string) {
      return apiClient.delete(`/articles/${id}`);
    },
    
    like(id: string) {
      return apiClient.post(`/articles/${id}/like`, {});
    }
  },
  
  // Comments
  comments: {
    getForArticle(articleId: string, params: Record<string, any> = {}) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });
      return apiClient.get(`/comments/article/${articleId}?${queryParams.toString()}`);
    },
    
    addToArticle(articleId: string, content: string) {
      return apiClient.post(`/comments/article/${articleId}`, { content });
    },
    
    reply(commentId: string, content: string) {
      return apiClient.post(`/comments/reply/${commentId}`, { content });
    },
    
    edit(commentId: string, content: string) {
      return apiClient.put(`/comments/${commentId}`, { content });
    },
    
    delete(commentId: string) {
      return apiClient.delete(`/comments/${commentId}`);
    },
    
    like(commentId: string) {
      return apiClient.post(`/comments/${commentId}/like`, {});
    }
  },
  
  // Uploads
  uploads: {
    base64Image(imageData: string, folder: string = 'articles') {
      return apiClient.post('/uploads/base64', { image: imageData, folder });
    },
    
    avatar(file: File) {
      const formData = new FormData();
      formData.append('avatar', file);
      return apiClient.uploadFile('/uploads/avatar', formData);
    },
    
    banner(file: File) {
      const formData = new FormData();
      formData.append('banner', file);
      return apiClient.uploadFile('/uploads/banner', formData);
    },
    
    articleImage(file: File) {
      const formData = new FormData();
      formData.append('image', file);
      return apiClient.uploadFile('/uploads/article-image', formData);
    }
  }
}; 