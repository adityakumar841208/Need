"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart, MessageCircle, Share2, Bookmark, CheckCircle, Search,
  Briefcase, Home, Zap, Wrench, User2, Scissors, Car, PenTool,
  Router
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    image: string;
    verified: boolean;
    type: "client" | "provider";
  };
  content: {
    text: string;
    image?: string;
    category?: string;
  };
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
}

export default function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const prevScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(false);


  // Enhanced mock data with categories
  const mockPosts: Post[] = [
    {
      id: "post-1",
      user: {
        id: "user-1",
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
        id: "user-2",
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
      engagement: { likes: 12, comments: 3, shares: 1, isLiked: true },
    },
    {
      id: "post-3",
      user: {
        id: "user-3",
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
      engagement: { likes: 18, comments: 6, shares: 4 },
    },
    {
      id: "post-4",
      user: {
        id: "user-4",
        name: "Sophia Johnson",
        image: "https://ui-avatars.com/api/?name=Sophia+Johnson&background=random",
        verified: false,
        type: "client",
      },
      content: {
        text: "Any good photographers available for a birthday event this weekend?",
        category: "photography",
      },
      timestamp: "1h ago",
      engagement: { likes: 30, comments: 8, shares: 5 },
    },
  ];

  // Trending searches
  const trendingTopics = [
    "Plumbing repairs",
    "Interior design",
    "Roof maintenance",
    "Electricians",
    "Home cleaning",
    "Event planning"
  ];

  // Fetch posts with filtering
  const fetchPosts = useCallback(() => {
    setLoading(true);

    // Simulated filtered data based on search and category
    setTimeout(() => {
      let filteredPosts = [...mockPosts];

      if (searchQuery) {
        filteredPosts = filteredPosts.filter(post =>
          post.content.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (activeCategory !== "all") {
        filteredPosts = filteredPosts.filter(post =>
          post.content.category === activeCategory
        );
      }

      setPosts(prev => [...prev, ...filteredPosts]);
      setLoading(false);
    }, 1000);
  }, [searchQuery, activeCategory]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPosts([]);
    fetchPosts();
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPosts([]);
  };

  // Toggle like status
  const toggleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.engagement.isLiked || false;
          return {
            ...post,
            engagement: {
              ...post.engagement,
              likes: isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1,
              isLiked: !isLiked
            }
          };
        }
        return post;
      })
    );
  };

  // Toggle bookmark status
  const toggleBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            engagement: {
              ...post.engagement,
              isBookmarked: !post.engagement.isBookmarked
            }
          };
        }
        return post;
      })
    );
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    });

    if (lastPostRef.current) observer.current.observe(lastPostRef.current);
  }, [loading, fetchPosts]);

  // Load initial posts

  useEffect(() => {
    fetchPosts();
  }, []);

  //for upside scroll detection 
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY.current) {
        setIsVisible(false);
        // console.log("scrolling down");
      } else if (currentScrollY < prevScrollY.current && currentScrollY > 200) {
        setIsVisible(true);
        // console.log("scrolling up");
      }
      

      prevScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <div className="max-w-full mx-auto py-6 px-4 md:py-8 md:px-6">
      {/* Header with search */}
      {isVisible ? <div className="mb-8 space-y-6 sticky -my-5 border top-16 z-30 bg-background rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Explore Services</h1>

          <form onSubmit={handleSearch} className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for services or providers..."
              className="pl-10 pr-4 bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Trending topics */}
        <div className="hidden md:block">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Trending:</p>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
                onClick={() => setSearchQuery(topic)}
              >
                <Zap className="w-3 h-3 mr-1 text-blue-500" />
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div> : <div className="mb-8 space-y-6 -my-5 bg-background/95 rounded-lg border p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Explore Services</h1>

          <form onSubmit={handleSearch} className="relative flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for services or providers..."
              className="pl-10 pr-4 bg-muted/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Trending topics */}
        <div className="hidden md:block">
          <p className="text-sm font-medium mb-2 text-muted-foreground">Trending:</p>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
                onClick={() => setSearchQuery(topic)}
              >
                <Zap className="w-3 h-3 mr-1 text-blue-500" />
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>}


      {/* Category tabs */}
      <Tabs
        defaultValue="all"
        className="mb-8"
        onValueChange={handleCategoryChange}
        value={activeCategory}
      >
        <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start md:justify-center p-0.5 bg-muted/50">
          <TabsTrigger value="all" className="flex items-center">All</TabsTrigger>
          <TabsTrigger value="home" className="flex items-center"><Home className="w-4 h-4 mr-1" /> Home</TabsTrigger>
          <TabsTrigger value="plumbing" className="flex items-center"><Wrench className="w-4 h-4 mr-1" /> Plumbing</TabsTrigger>
          <TabsTrigger value="electrical" className="flex items-center"><Zap className="w-4 h-4 mr-1" /> Electrical</TabsTrigger>
          <TabsTrigger value="beauty" className="flex items-center"><Scissors className="w-4 h-4 mr-1" /> Beauty</TabsTrigger>
          <TabsTrigger value="automotive" className="flex items-center"><Car className="w-4 h-4 mr-1" /> Automotive</TabsTrigger>
        </TabsList>

        {/* Main content area - improved masonry layout */}
        <TabsContent value={activeCategory} className="mt-6">
          {posts.length === 0 && !loading ? (
            <div className="text-center py-16 bg-muted/30 rounded-lg">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className=" columns-1 gap-x-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  ref={index === posts.length - 1 ? lastPostRef : null}
                >
                  <Card className="mt-2 overflow-hidden flex flex-col border shadow-sm hover:shadow-md transition-shadow duration-300 relative bg-card text-card-foreground">
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        variant={post.user.type === "provider" ? "default" : "secondary"}
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--badge-bg)',
                          color: 'var(--badge-text)',
                        }}
                      >
                        {post.user.type === "provider" ? (
                          <>
                            <Wrench className="w-3 h-3 mr-1" /> Provider
                          </>
                        ) : (
                          <>
                            <User2 className="w-3 h-3 mr-1" /> Client
                          </>
                        )}
                      </Badge>
                    </div>

                    <CardHeader
                      className="flex flex-row items-center gap-4 pb-3 cursor-pointer"
                      onClick={() => router.push(`/home/showprofile/${post.user.id}`)}
                    >
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={post.user.image} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm">{post.user.name}</span>
                          {post.user.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-200" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-3 flex-grow">
                      <p className="text-sm">{post.content.text}</p>

                      {post.content.image && (
                        <div className="relative rounded-md overflow-hidden mt-4 bg-muted">
                          <img
                            src={post.content.image}
                            alt="Post content"
                            className="object-cover w-full h-auto max-h-[400px] hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex justify-between border-t py-2.5 bg-background/50 mt-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(post.id)}
                        className={`text-xs gap-1.5 ${post.engagement.isLiked ? 'text-red-500' : 'text-muted-foreground'
                          }`}
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${post.engagement.isLiked ? 'fill-current' : ''
                            }`}
                        />
                        <span>{post.engagement.likes}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5 text-muted-foreground"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>{post.engagement.comments}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs gap-1.5 text-muted-foreground"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>{post.engagement.shares}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(post.id)}
                        className={`text-xs ${post.engagement.isBookmarked ? 'text-blue-500' : 'text-muted-foreground'
                          }`}
                      >
                        <Bookmark
                          className={`h-3.5 w-3.5 ${post.engagement.isBookmarked ? 'fill-current' : ''
                            }`}
                        />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Loading state */}
      <div className="columns-1 gap-x-4">
        {loading &&
          Array(4)
            .fill(0)
            .map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="mt-2 overflow-hidden flex flex-col border shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 relative bg-card text-card-foreground animate-pulse"
                style={{ height: '100%', width: '100%' }}
              >
                {/* Header */}
                <div className="flex flex-row items-center gap-4 p-4">
                  <div className="h-10 w-10 rounded-full bg-muted/40"></div>
                  <div className="flex flex-col flex-1">
                    <div className="h-4 w-24 bg-muted/40 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-muted/40 rounded"></div>
                  </div>
                </div>
                {/* Content */}
                <div className="px-4 pb-4 flex-grow space-y-2">
                  <div className="h-4 w-3/4 bg-muted/40 rounded"></div>
                  <div className="h-4 w-5/6 bg-muted/40 rounded"></div>
                  <div className="h-40 bg-muted/40 rounded-md mt-4"></div>
                </div>
                {/* Footer */}
                <div className="flex justify-between border-t py-2.5 bg-background/50 px-4">
                  <div className="h-4 w-16 bg-muted/40 rounded"></div>
                  <div className="h-4 w-16 bg-muted/40 rounded"></div>
                  <div className="h-4 w-16 bg-muted/40 rounded"></div>
                  <div className="h-4 w-16 bg-muted/40 rounded"></div>
                </div>
              </motion.div>
            ))}
      </div>

    </div>
  );
}