import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '../../lib/services/articleService';
import { useAuth } from '../../lib/contexts/AuthContext';
import ArticleContent from '../article/article-content';
import ArticleSidebar from '../article/article-sidebar';
import CommentsSection from '../article/comments-section';
import RelatedArticles from '../article/related-articles';
import { Button } from '../ui/button';

interface Article {
  _id: string;
  title: string;
  content: any; // Changed from string to any to support Editor.js content structure
  author: {
    _id: string;
    username: string;
    name?: string;
    title?: string;
    avatar?: string;
  };
  status: 'draft' | 'published';
  tags?: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views?: number;
  likedBy?: string[];
}

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    title?: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface CommentResponse {
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
}

interface ArticleResponse {
  article: Article;
  comments?: any[];
}

interface ArticleDetailProps {
  id: string | undefined;
}

export function ArticleDetail({ id }: ArticleDetailProps) {
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  // Like state
  const [userLiked, setUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  // Article reference 
  const articleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle();
      console.log(article);
    }
  }, [id]);
  
  // Fetch comments when page changes
  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [commentPage, id]);

  const fetchArticle = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await articleService.getArticleById(id) as Article | ArticleResponse;
      
      // Check if response has article property (new API format) or is the article itself (old format)
      let articleData: Article;
      if ('article' in response) {
        articleData = response.article;
      } else {
        articleData = response;
      }
      
      setArticle(articleData);
      setLikeCount(articleData.likes || 0);
      
      // Check if user has liked this article
      if (user && articleData.likedBy) {
        setUserLiked(articleData.likedBy.includes(user._id));
      }
      
      console.log("Article data received:", articleData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComments = async () => {
    if (!id) return;
    try {
      setCommentsLoading(true);
      const response = await articleService.getArticleComments(id, commentPage);
      setComments(response.comments);
      setTotalCommentPages(response.totalPages);
      setTotalComments(response.totalComments);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
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
  
  const handleLikeArticle = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (!id || !article) return;
    
    try {
      const response = await articleService.likeArticle(id);
      setLikeCount(response.likes);
      setUserLiked(response.userLiked);
    } catch (err) {
      console.error("Error liking article:", err);
    }
  };
  
  const handleAddComment = async (content: string) => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (!id || !content.trim()) return;
    
    try {
      await articleService.addComment(id, content);
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };
  
  const handleAddReply = async (commentId: string, content: string) => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    if (!commentId || !content.trim()) return;
    
    try {
      await articleService.replyToComment(commentId, content);
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Error replying to comment:", err);
    }
  };
  
  const handleLoadMoreComments = () => {
    if (commentPage < totalCommentPages) {
      setCommentPage(prevPage => prevPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md dark:bg-destructive/20">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-muted-foreground">
          Article not found
        </div>
      </div>
    );
  }

  const canEdit = user && (user.role === 'admin' || (article.author && user._id === article.author._id));
  const canDelete = user && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3" ref={articleRef}>
          <ArticleContent
            article={article}
            handleLikeArticle={handleLikeArticle}
            userLiked={userLiked}
            likeCount={likeCount}
          />
          
          {canEdit || canDelete ? (
            <div className="flex justify-end space-x-4 mt-6">
              {canEdit && (
                <Button
                  onClick={() => navigate(`/dashboard/write?id=${id}`)}
                  variant="default"
                >
                  Edit Article
                </Button>
              )}
              {canDelete && (
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                >
                  Delete Article
                </Button>
              )}
            </div>
          ) : null}
          
          <div className="mt-16">
            <RelatedArticles 
              currentArticleId={article._id}
              tags={article.tags}
              category={article.category}
            />
          </div>
          
          <div className="mt-16">
            <CommentsSection 
              comments={comments}
              articleId={article._id}
              totalComments={totalComments}
              currentPage={commentPage}
              totalPages={totalCommentPages}
              onAddComment={handleAddComment}
              onAddReply={handleAddReply}
              onLoadMoreComments={handleLoadMoreComments}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ArticleSidebar 
            article={article}
            handleLikeArticle={handleLikeArticle}
            userLiked={userLiked}
          />
        </div>
      </div>
    </div>
  );
} 