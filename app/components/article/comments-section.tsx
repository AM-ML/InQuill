import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Reply, MoreHorizontal, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "../../lib/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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

interface CommentsProps {
  comments: Comment[];
  articleId: string;
  totalComments: number;
  currentPage: number;
  totalPages: number;
  onAddComment: (content: string) => Promise<void>;
  onAddReply: (commentId: string, content: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  onLoadMoreComments: () => void;
}

export default function CommentsSection({
  comments = [],
  articleId,
  totalComments = 0,
  currentPage = 1,
  totalPages = 1,
  onAddComment,
  onAddReply,
  onLikeComment,
  onLoadMoreComments
}: CommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitComment = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (newComment.trim()) {
      try {
        await onAddComment(newComment);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const content = replyContent[commentId];
    if (content && content.trim()) {
      try {
        await onAddReply(commentId, content);
        setReplyContent(prev => ({ ...prev, [commentId]: "" }));
        setReplyTo(null);
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (onLikeComment) {
      await onLikeComment(commentId);
    }
  };

  // Format date
  const formatDate = (date: string) => {
    if (!date) return '';
    try {
      const dateObj = new Date(date);
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-6 w-6" />
          <h2 className="text-3xl font-bold">Discussion</h2>
          <Badge variant="secondary">{totalComments} comments</Badge>
        </div>
        <p className="text-muted-foreground">
          Join the conversation and share your thoughts on this article
        </p>
      </motion.div>

      {/* Comment Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Comment</CardTitle>
            <CardDescription>Share your insights and engage with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder={user ? "Share your thoughts on this article..." : "Please log in to comment"}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={4}
                disabled={!user}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {user ? "Comments are moderated and must follow our community guidelines" : (
                    <a 
                      href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} 
                      className="text-blue-600 hover:underline"
                    >
                      Log in
                    </a>
                  )}
                </p>
                <Button 
                  onClick={handleSubmitComment} 
                  disabled={!user || !newComment.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post Comment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Comment Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
                        <AvatarFallback>
                          {comment.author.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{comment.author.username}</h4>
                          {comment.author.title && (
                            <Badge variant="secondary" className="text-xs">
                              {comment.author.title}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report comment</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(window.location.href + `#comment-${comment._id}`);
                        }}>
                          Copy link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Comment Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleLikeComment(comment._id)}
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                      disabled={!user}
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 pt-4 border-t"
                    >
                      <div className="space-y-3">
                        <Textarea 
                          placeholder={`Reply to ${comment.author.username}...`} 
                          value={replyContent[comment._id] || ''}
                          onChange={(e) => setReplyContent({
                            ...replyContent, 
                            [comment._id]: e.target.value
                          })}
                          rows={3} 
                        />
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setReplyTo(null)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleSubmitReply(comment._id)}
                            disabled={!replyContent[comment._id]?.trim()}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 space-y-4 pt-4 border-t">
                      {comment.replies.map((reply) => (
                        <div key={reply._id} className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.username} />
                              <AvatarFallback>
                                {reply.author.username
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h5 className="font-medium text-sm">{reply.author.username}</h5>
                                {reply.author.title && (
                                  <Badge variant="secondary" className="text-xs">
                                    {reply.author.title}
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 text-xs"
                                  onClick={() => handleLikeComment(reply._id)}
                                >
                                  <Heart className="h-3 w-3 mr-1" />
                                  {reply.likes}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load More Comments */}
      {currentPage < totalPages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <Button 
            variant="outline"
            onClick={onLoadMoreComments}
          >
            Load More Comments
          </Button>
        </motion.div>
      )}
    </section>
  );
} 