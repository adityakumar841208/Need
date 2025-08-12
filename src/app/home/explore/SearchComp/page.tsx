'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Post } from '@/types/post';
import { PostCard } from '../PostCard/page';
import { Button } from '@/components/ui/button';

interface SearchComponentProps {
  query: string;
  onBack: () => void;
  results: Post[];
  isLoading: boolean;
}

export default function SearchComponent({ query, onBack, results, isLoading }: SearchComponentProps) {
    const lastPostRef = useRef<HTMLDivElement>(null!);
    // Add state for committed query - only updates when search is executed
    const [committedQuery, setCommittedQuery] = useState("");
    
    // Update committed query when results change or when loading completes
    useEffect(() => {
        if (!isLoading && query) {
            setCommittedQuery(query);
        }
    }, [isLoading, query, results]);

    const handleShare = (postId: string) => {
        // This should be forwarded to parent component
        console.log('Share post:', postId);
    };

    const handleBookmark = (postId: string) => {
        // This should be forwarded to parent component
        console.log('Bookmark post:', postId);
    };

    const handleProfileClick = (userId: string) => {
        // This should be forwarded to parent component
        console.log('View profile:', userId);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl flex justify-evenly font-bold text-gray-900 mb-6">
                <p>Search Results {committedQuery && `for "${committedQuery}"`}</p>
                <Button 
                    onClick={onBack}
                    disabled={isLoading}
                >
                    Go Back
                </Button>
            </h2>
            
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Searching...</span>
                </div>
            )}

            {!isLoading && results.length === 0 && committedQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No posts found for &quot;{committedQuery}&quot;</p>
                </div>
            )}

            {!isLoading && results.length === 0 && !committedQuery && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Enter a search query to find posts</p>
                </div>
            )}
            
            {results.map((post, index) => (
                <PostCard
                    key={post._id.toString()}
                    post={post}
                    index={index}
                    isLast={index === results.length - 1}
                    lastPostRef={lastPostRef}
                    onLike={(postId) => console.log('Like post:', postId)}
                    onShare={handleShare}
                    onBookmark={handleBookmark}
                    onProfileClick={handleProfileClick}
                />
            ))}
        </div>
    );
}