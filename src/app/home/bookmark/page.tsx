'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark as BookmarkIcon, MessageCircle, Heart, Share2, CheckCircle } from "lucide-react";
import { useAppSelector } from '@/store/hooks';

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    image: string;
    verified: boolean;
    role: string;
  };
  content: {
    text: string;
    image?: string;
    category: string;
  };
  engagement: {
    likes: {
      count: number;
      users: any[];
    };
    comments: {
      count: number;
      users: any[];
    };
    shares: number;
    saves: number;
  };
  timestamp: string;
  tags?: string[];
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function Bookmark() {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAppSelector(state => state.profile);

  useEffect(() => {
    async function fetchBookmarkedPosts() {
      try {
        const response = await fetch('/api/engagement/bookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookmarks: user.bookmarks })
        });

        const data = await response.json();
        setBookmarkedPosts(data.posts || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        setIsLoading(false);
      }
    }

    fetchBookmarkedPosts();
  }, [user.bookmarks]);

  const removeBookmark = (id: string) => {
    setIsLoading(true);
    const updatedBookmarks = user.bookmarks.filter((bookmark: string) => bookmark !== id);
    const res = fetch('/api/engagement/bookmark', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId: id, userId: user._id, bookmarks: updatedBookmarks })

    }).then(response => response.json())
      .then(data => {
        console.log('Bookmark removed:', data);
        setBookmarkedPosts(prevPosts => prevPosts.filter(post => post._id !== id));
        setIsLoading(false);
      })
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const createChat = async (userId: string) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      console.log('Chat created:', data);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
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
            <Card key={post._id} className="overflow-hidden border-muted h-fit">
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
                    <Badge variant={post.user.role === 'serviceprovider' ? "default" : "outline"}>
                      {post.user.role === 'serviceprovider' ? 'Provider' : 'Client'}
                    </Badge>
                    <span>·</span>
                    <span>{new Date(post.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBookmark(post._id)}
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

              <CardFooter className="p-2 border-t flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button size="sm" variant="outline" className='w-1/2'>View Profile</Button>
                  <Button size="sm" className='w-1/2' onClick={()=>createChat(post.user._id)}>Message Now</Button>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" /> {post.engagement?.likes?.count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" /> {post.engagement?.comments?.count ?? 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" /> {post.engagement?.shares ?? 0}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <BookmarkIcon className="h-4 w-4" /> {post.engagement?.saves ?? 0}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}