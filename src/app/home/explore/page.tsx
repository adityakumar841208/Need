"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { debounce } from 'lodash';
import DOMPurify from 'dompurify';
import { ExploreHeader } from "./ExploreHeader/page";
import { PostCard } from "./PostCard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Skeleton from "./skeleton/page";
import { Post } from "@/types/post"; // Create this type file
import { usePosts } from "@/hooks/usePosts";

export default function Explore() {
  const router = useRouter();
  const {
    posts,
    loading,
    fetchPosts,
    toggleLike,
    toggleBookmark,
    updateEngagement
  } = usePosts();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  const lastPostRef = useRef<HTMLDivElement | null>(null);
  const prevScrollY = useRef(0);
  const initialLoadRef = useRef(false);

  const trendingTopics = useMemo(() => [
    "Plumbing repairs",
    "Interior design",
    "Roof maintenance",
    "Electricians",
    "Home cleaning",
    "Event planning"
  ], []);

  const handleScroll = useMemo(
    () =>
      debounce(() => {
        const currentScrollY = window.scrollY;
        setIsVisible(prev => 
          currentScrollY < prevScrollY.current && currentScrollY > 200
        );
        prevScrollY.current = currentScrollY;
      }, 100),
    []
  );

  useEffect(() => {
    if (!initialLoadRef.current) {
      fetchPosts(1);
      initialLoadRef.current = true;
    }
  }, [fetchPosts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener("scroll", handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const handleSearch = useMemo(() => 
    debounce((query: string) => {
      const sanitizedQuery = DOMPurify.sanitize(query);
      setSearchQuery(sanitizedQuery);
      setPage(1);
      fetchPosts(1);
    }, 500),
    [fetchPosts]
  );

  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category);
    setPage(1);
    fetchPosts(1);
  }, [fetchPosts]);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage);
      }
    },
    [loading, page, fetchPosts]
  );

  useEffect(() => {
    if (!lastPostRef.current || loading) return;

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.5
    });

    const currentRef = lastPostRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [observerCallback, loading]);

  return (
    <div className="sm:w-3/5 w-full mx-auto py-6 px-4 md:py-8 md:px-6">
      <ExploreHeader
        isVisible={isVisible}
        searchQuery={searchQuery}
        onSearchChange={(query) => handleSearch(query)}
        onSearch={(e) => {
          e.preventDefault();
          handleSearch(searchQuery);
        }}
        trendingTopics={trendingTopics}
      />

      <Tabs value={activeCategory} onValueChange={handleCategoryChange}>
        {/* ...existing tabs code... */}
      </Tabs>

      <div className="columns-1 gap-x-4">
        {posts.map((post, index) => (
          <PostCard
            key={post._id.toString() + index}
            post={post}
            index={index}
            isLast={index === posts.length - 1}
            lastPostRef={lastPostRef as React.RefObject<HTMLDivElement>}
            onLike={toggleLike}
            onShare={(postId) => updateEngagement(postId, 'share', 'add')}
            onBookmark={toggleBookmark}
            onProfileClick={(userId) => router.push(`/home/showprofile/${userId}`)}
          />
        ))}
      </div>

      {loading && <Skeleton />}
    </div>
  );
}