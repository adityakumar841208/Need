import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle, Wrench, User2, Send } from "lucide-react";
import { Post } from "@/types/post";
import { useAppSelector } from "@/store/hooks";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface PostCardProps {
  post: Post;
  index: number;
  isLast: boolean;
  lastPostRef: React.RefObject<HTMLDivElement>;
  onLike: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onProfileClick: (userId: string) => void;
}

export function PostCard({
  post,
  index,
  isLast,
  lastPostRef,
  onLike,
  onShare,
  onBookmark,
  onProfileClick
}: PostCardProps) {
  const user = useAppSelector(state => state.profile);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const [comments, setComments] = useState(
    Array.isArray(post.engagement?.comments?.users)
      ? post.engagement.comments.users
      : []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Create temporary comment for optimistic UI update
      const newComment = {
        _id: `temp-${Date.now()}`,
        user: {
          _id: user?._id || 'unknown',
          name: user?.name || 'Anonymous',
          image: user?.profilePicture || '',
          verified: user?.isVerified || false
        },
        content: commentText,
        timestamp: new Date(),
        reply: null
      };

      // Optimistically update UI
      setComments([newComment, ...comments]);
      setCommentText('');

      // Send to the correct API endpoint
      try {
        const response = await fetch(`/api/engagement/comment/${post._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?._id,
            name: user?.name,
            image: user?.profilePicture,
            verified: user?.isVerified,
            content: newComment.content,
            reply: null // For top-level comments
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Replace temporary comment with server comment
          setComments((prev: any) =>
            prev.map((c: any) => c._id === newComment._id ? data.comment : c)
          );
        } else {
          // If request fails, remove the optimistic comment
          setComments((prev: any) => prev.filter((c: any) => c._id !== newComment._id));
          console.error('Failed to post comment:', await response.text());
        }
      } catch (error) {
        // If there's a network error, remove the optimistic comment
        setComments((prev: any) => prev.filter((c: any) => c._id !== newComment._id));
        console.error('API error:', error);
      }

    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      ref={isLast ? lastPostRef : null}
    >
      <Card className="mb-4 overflow-hidden">
        <CardHeader className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar
              className="cursor-pointer"
              onClick={() => onProfileClick(post.user._id.toString())}
            >
              <AvatarImage src={post.user.image} alt={post.user.name} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => onProfileClick(post.user._id.toString())}
                >
                  {post.user.name}
                </h3>
                {post.user.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                {post.user.role === 'serviceprovider' ? (
                  <Wrench className="h-3 w-3" />
                ) : (
                  <User2 className="h-3 w-3" />
                )}
                <span className="capitalize">{post.user.role}</span>
                <span>•</span>
                <time>{new Date(post.timestamp).toLocaleDateString()}</time>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0">
          {post.content.text && (
            <p className="text-sm md:text-base mb-4 leading-relaxed text-foreground/90">
              {post.content.text}
            </p>
          )}

          {post.content.image && (
            <div className="relative w-full rounded-lg overflow-hidden mb-4">
              <div className="relative min-h-[200px] max-h-[400px] md:max-h-[500px] lg:max-h-[600px]">
                <img
                  src={post.content.image}
                  alt="Post content"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  style={{
                    maxHeight: '100%',
                    width: 'auto',
                    margin: '0 auto'
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
              {post.tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="text-xs md:text-sm px-2 py-0.5 hover:bg-secondary/80"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex-col">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${post.engagement.likes.users.some(
                  like => like.user._id.toString() === user?._id?.toString()
                ) ? 'text-red-500' : ''
                  }`}
                onClick={() => onLike(post._id.toString())}
              >
                <Heart className="h-4 w-4" />
                <span>{post.engagement.likes.count}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${showComments ? 'bg-secondary/50' : ''}`}
                onClick={toggleComments}
              >
                <MessageCircle className="h-4 w-4" />
                <span>{comments.length || post.engagement.comments.count || 0}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => onShare(post._id.toString())}
              >
                <Share2 className="h-4 w-4" />
                <span>{post.engagement.shares}</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => onBookmark(post._id.toString())}
            >
              <Bookmark className="h-4 w-4" />
              <span>{post.engagement.saves}</span>
            </Button>
          </div>

          {showComments && (
            <div className="w-full mt-4 pt-2">
              <Separator className="mb-4" />

              <div className="flex items-start gap-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture || undefined} alt={user?.name || undefined} />
                  <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    className="resize-none min-h-[40px] text-sm flex-1"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-10"
                    onClick={handleCommentSubmit}
                    disabled={isSubmitting || !commentText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pb-2">
                {comments.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment: any) => (
                    <div
                      key={comment._id}
                      className="flex items-start space-x-2 pb-2"
                    >
                      <Avatar className="w-7 h-7">
                        <AvatarImage src={comment.user.profilePicture} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-muted p-2 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-medium">{comment.user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}

              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}