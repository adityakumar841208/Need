import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { color, motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle, Wrench, User2 } from "lucide-react";
import { Post } from "@/types/post"; // Create this type file
import { useAppSelector } from "@/store/hooks";

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
          {/* Text content with better readability */}
          {post.content.text && (
            <p className="text-sm md:text-base mb-4 leading-relaxed text-foreground/90">
              {post.content.text}
            </p>
          )}

          {/* Image with aspect ratio and responsive height */}
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

          {/* Tags with improved spacing and responsiveness */}
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

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              {/* like */}
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 ${post.engagement.likes.users.some(
                  like => like.user._id.toString() === user?._id?.toString()
                ) ? 'text-red-500' : ''
                  }`}
                onClick={() => onLike(post._id.toString())}
              >
                <Heart className="h-4 w-4"/>
                <span>{post.engagement.likes.count}</span>
              </Button>
              {/* comment */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.engagement.comments.count}</span>
              </Button>
              {/* share */}
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
            {/* bookmark */}
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
        </CardFooter>
      </Card>
    </motion.div>
  );
}