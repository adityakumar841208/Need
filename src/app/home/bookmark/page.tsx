'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark as BookmarkIcon, MessageCircle, Heart, Share2, CheckCircle, X } from "lucide-react";

interface User {
  name: string;
  image: string;
  verified: boolean;
  type: 'provider' | 'client';
}

interface Content {
  text: string;
  image?: string;
  category: string;
}

interface Engagement {
  likes: number;
  comments: number;
  shares: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Post {
  id: string;
  user: User;
  content: Content;
  timestamp: string;
  engagement: Engagement;
}

export default function Bookmark() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookmarkedPosts() {
      try {
        // In a real app, you would fetch from API
        // const response = await fetch('/api/bookmarks');
        // const data = await response.json();
        
        // Using mock data
        const mockPosts: Post[] = [
          {
            id: "post-1",
            user: {
              name: "John Doe",
              image: "https://ui-avatars.com/api/?name=John+Doe&background=random",
              verified: true,
              type: "provider",
            },
            content: {
              text: "Just finished an amazing kitchen renovation. Let me know if you need remodeling services!",
              image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=800",
              category: "home",
            },
            timestamp: "2h ago",
            engagement: { likes: 24, comments: 5, shares: 2, isLiked: false, isBookmarked: true },
          },
          {
            id: "post-2",
            user: {
              name: "Emma Watson",
              image: "https://ui-avatars.com/api/?name=Emma+Watson&background=random",
              verified: false,
              type: "client",
            },
            content: {
              text: "Looking for an electrician near me. Any recommendations?",
              category: "electrical",
            },
            timestamp: "5h ago",
            engagement: { likes: 12, comments: 3, shares: 1, isLiked: true, isBookmarked: true },
          },
          {
            id: "post-3",
            user: {
              name: "Michael Smith",
              image: "https://ui-avatars.com/api/?name=Michael+Smith&background=random",
              verified: true,
              type: "provider",
            },
            content: {
              text: "Need someone to fix your plumbing? Contact me for the best services in town!",
              image: "https://images.unsplash.com/photo-1580341289255-5b47c98a59dd?q=80&w=800",
              category: "plumbing",
            },
            timestamp: "3h ago",
            engagement: { likes: 18, comments: 6, shares: 4, isBookmarked: true },
          },
        ];
        
        // Filter only bookmarked posts
        const bookmarked = mockPosts.filter(post => post.engagement.isBookmarked);
        setBookmarkedPosts(bookmarked);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        setIsLoading(false);
      }
    }

    fetchBookmarkedPosts();
  }, []);

  const removeBookmark = (id: string) => {
    setBookmarkedPosts(prev => prev.filter(post => post.id !== id));
    // In a real app: fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarked Posts</h1>
      
      {bookmarkedPosts.length === 0 ? (
        <Card className="p-8 text-center bg-muted/30">
          <div className="flex flex-col items-center gap-2">
            <BookmarkIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-xl font-semibold">No bookmarks yet</h3>
            <p className="text-muted-foreground">
              Posts you bookmark will appear here for easy access.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          {bookmarkedPosts.map(post => (
            <Card key={post.id} className="overflow-hidden border-muted h-fit">
              <CardHeader className="p-4 pb-0 flex flex-row cursor-pointer items-center gap-2">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={post.user.image} alt={post.user.name} />
                  <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{post.user.name}</span>
                    {post.user.verified && (
                      <CheckCircle className="h-4 w-4 fill-primary text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant={post.user.type === 'provider' ? "default" : "outline"}>
                      {post.user.type === 'provider' ? 'Provider' : 'Client'}
                    </Badge>
                    <span>·</span>
                    <span>{post.timestamp}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeBookmark(post.id)}
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <BookmarkIcon className="h-5 w-5 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <Badge variant="outline" className="mb-2">
                    {post.content.category}
                  </Badge>
                  <p className="text-base">{post.content.text}</p>
                </div>
                
                {post.content.image && (
                  <div className="relative h-60 w-full rounded-md overflow-hidden mt-3">
                    <Image 
                      src={post.content.image}
                      alt="Post image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-2 border-t flex justify-between">
                <div className="flex gap-2 w-full">
                  <Button size="sm" variant="outline" className='w-1/2'>View Profile</Button>
                  <Button size="sm" className='w-1/2'>Message Now</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}