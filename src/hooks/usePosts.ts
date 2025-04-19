import { useState, useCallback, useRef } from 'react';
import { Post, PostResponse } from '@/types/post';
import { Types } from 'mongoose';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserBookmarks } from '@/store/profile/profileSlice';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.profile);
  const fetchedPagesRef = useRef<Set<number>>(new Set());
  const dispatch = useAppDispatch();

  const fetchPosts = useCallback(async (page: number = 1) => {
    // Prevent duplicate fetches for the same page
    if (fetchedPagesRef.current.has(page) || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/fetchposts?page=${page}`);
      const data: PostResponse[] = await res.json();

      // Convert string IDs back to ObjectIds for internal state
      const convertedPosts: Post[] = data.map(post => ({
        ...post,
        _id: new Types.ObjectId(post._id),
        user: {
          ...post.user,
          _id: new Types.ObjectId(post.user._id)
        },
        timestamp: new Date(post.timestamp),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
        engagement: {
          ...post.engagement,
          likes: {
            ...post.engagement.likes,
            users: post.engagement.likes.users.map(like => ({
              user: {
                _id: new Types.ObjectId(like.user._id)
              },
              timestamp: new Date(like.timestamp)
            }))
          }
        }
      }));

      setPosts(prev =>
        page === 1 ? convertedPosts : [...prev, ...convertedPosts]
      );

      fetchedPagesRef.current.add(page);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    if (!user?._id) return;

    // Find current post and check if already liked
    const currentPost = posts.find(p => p._id.toString() === postId);
    if (!currentPost) return;

    const hasLiked = currentPost.engagement.likes.users.some(
      like => like.user._id.toString() === user._id
    );

    try {
      // First update UI optimistically
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post._id.toString() === postId) {
            return {
              ...post,
              engagement: {
                ...post.engagement,
                likes: {
                  count: hasLiked ? post.engagement.likes.count - 1 : post.engagement.likes.count + 1,
                  users: hasLiked
                    ? post.engagement.likes.users.filter(
                      like => like.user._id.toString() !== user._id
                    )
                    : [
                      ...post.engagement.likes.users,
                      {
                        user: { _id: new Types.ObjectId(user._id?.toString()) },
                        timestamp: new Date()
                      }
                    ]
                }
              }
            };
          }
          return post;
        })
      );

      // Then make API request with explicit action
      const response = await fetch(`/api/engagement/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`
        },
        body: JSON.stringify({
          type: 'like',
          action: hasLiked ? 'remove' : 'add', // Explicitly specify the action
          userId: user._id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      // Get updated data from server
      const updatedPost = await response.json();
      console.log(updatedPost)

      // Update with server data to ensure consistency
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post._id.toString() === postId
            ? { ...post, engagement: updatedPost.engagement }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert to original state on error
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post._id.toString() === postId
            ? currentPost
            : post
        )
      );
    }
  }, [user?._id, posts]);

  const toggleBookmark = useCallback(async (postId: string) => {
    if (!user?._id) return;

    try {
      // Find current post and check if already bookmarked
      const currentPost = posts.find(p => p._id.toString() === postId);
      if (!currentPost) return;

      const isCurrentlyBookmarked = user.bookmarks ? user.bookmarks.some(
        id => id.toString() === postId
      ) : false;

      // Optimistic update
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post._id.toString() === postId) {
            return {
              ...post,
              engagement: {
                ...post.engagement,
                saves: Math.max(
                  0,
                  post.engagement.saves + (isCurrentlyBookmarked ? -1 : 1)
                ),
                isBookmarked: !isCurrentlyBookmarked
              }
            };
          }
          return post;
        })
      );

      // Make API call to update user's bookmarks
      const response = await fetch(`/api/engagement/bookmark`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user._id}`
        },
        body: JSON.stringify({
          userId: user._id,
          postId,
          role: user.role,
          action: isCurrentlyBookmarked ? 'remove' : 'add'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update bookmark');
      }

      // Get the updated user data with bookmarks
      const data = await response.json();

      // Store updated bookmarks in Redux if needed
      dispatch(updateUserBookmarks(data.bookmarks));

    } catch (error) {
      console.error('Error updating bookmark:', error);
      // Revert the optimistic update on error
      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post._id.toString() === postId) {
            const isCurrentlyBookmarked = user.bookmarks ? user.bookmarks.some(
              id => id.toString() === postId
            ) : false;
            return {
              ...post,
              engagement: {
                ...post.engagement,
                saves: post.engagement.saves + (isCurrentlyBookmarked ? 1 : -1),
                isBookmarked: isCurrentlyBookmarked
              }
            };
          }
          return post;
        })
      );
    }
  }, [user, posts]);

  const updateEngagement = useCallback(async (
    postId: string,
    type: 'share' | 'view',
    action: 'add' | 'remove'
  ) => {
    if (!user?._id) return;

    try {
      const response = await fetch(`/api/engagement/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`
        },
        body: JSON.stringify({ type, action }),
      });

      if (!response.ok) throw new Error('Failed to update engagement');

      const updatedEngagement = await response.json();

      setPosts(currentPosts =>
        currentPosts.map(post => {
          if (post._id.toString() === postId) {
            return {
              ...post,
              engagement: updatedEngagement
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error updating engagement:', error);
    }
  }, [user]);

  return {
    posts,
    loading,
    fetchPosts,
    toggleLike,
    toggleBookmark,
    updateEngagement
  };
}