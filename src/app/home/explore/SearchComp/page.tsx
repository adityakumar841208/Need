'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Post } from '@/types/post';
import { Types } from 'mongoose';
import { PostCard } from '../PostCard/page';
import { Button } from '@/components/ui/button';

interface SearchResponse {
    serviceProviders: Array<{
        _id: string;
        name: string;
        service: string;
        [key: string]: unknown;
    }>;
    posts: Array<{
        _id: string;
        user: {
            _id: string;
            name: string;
            image: string;
            verified: boolean;
            role: 'serviceprovider' | 'customer';
        };
        content: {
            text: string;
            image: string;
        };
        views: number;
        tags: string[];
        timestamp: string;
        engagement: {
            likes: {
                count: number;
                users: LikeUser[];
            };
            comments: {
                count: number;
                users: CommentUser[];
            };
            shares: number;
            saves: number;
        };
        createdAt: string;
        updatedAt: string;
    }>;
}

interface LikeUser {
    user: {
        _id: string;
    };
    timestamp: string;
}

interface CommentUser {
    user: {
        _id: string;
        name: string;
        profilePicture: string;
        verified: boolean;
    };
    reply: string | null;
    content: string;
    timestamp: string;
}

export default function SearchComponent( { query, onBack }: { query: string, onBack: () => void }) {
    const [searchQuery, setSearchQuery] = useState(query || '');
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const lastPostRef = useRef<HTMLDivElement>(null!);

    // Search functionality
    const searchPosts = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setPosts([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const data: SearchResponse = await response.json();
            
            // Convert the posts from the API response to proper Post objects
            const convertedPosts: Post[] = data.posts.map(post => ({
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
                        users: post.engagement.likes.users.map((like: LikeUser) => ({
                            user: {
                                _id: new Types.ObjectId(like.user._id)
                            },
                            timestamp: new Date(like.timestamp)
                        }))
                    },
                    comments: {
                        ...post.engagement.comments,
                        users: post.engagement.comments.users.map((comment: CommentUser) => ({
                            ...comment,
                            user: {
                                ...comment.user,
                                _id: new Types.ObjectId(comment.user._id)
                            },
                            timestamp: new Date(comment.timestamp),
                            reply: comment.reply ? new Types.ObjectId(comment.reply) : null
                        }))
                    }
                }
            }));

            setPosts(convertedPosts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while searching');
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    // Search when query changes
    useEffect(() => {
        if (query) {
            setSearchQuery(query);
            searchPosts(query);
        }
    }, [query]);

    // PostCard handlers
    const handleLike = (postId: string) => {
        // TODO: Implement like functionality
        console.log('Like post:', postId);
    };

    const handleShare = (postId: string) => {
        // TODO: Implement share functionality
        console.log('Share post:', postId);
    };

    const handleBookmark = (postId: string) => {
        // TODO: Implement bookmark functionality
        console.log('Bookmark post:', postId);
    };

    const handleProfileClick = (userId: string) => {
        // TODO: Implement profile navigation
        console.log('View profile:', userId);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl flex justify-evenly font-bold text-gray-900 mb-6">
                
                <p>Search Results {searchQuery && `for "${searchQuery}"`}</p>
                <Button 
                    onClick={onBack}
                    disabled={loading}
                >
                    Go Back
                </Button>

            </h2>
            
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Searching...</span>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">{error}</p>
                </div>
            )}

            {!loading && !error && posts.length === 0 && searchQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No posts found for &quot;{searchQuery}&quot;</p>
                </div>
            )}

            {!loading && !error && posts.length === 0 && !searchQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Enter a search query to find posts</p>
                </div>
            )}
            
            {posts.map((post, index) => (
                <PostCard
                    key={post._id.toString()}
                    post={post}
                    index={index}
                    isLast={index === posts.length - 1}
                    lastPostRef={lastPostRef}
                    onLike={handleLike}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                    onProfileClick={handleProfileClick}
                />
            ))}
        </div>
    );
}