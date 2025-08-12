"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { debounce } from 'lodash';
import DOMPurify from 'dompurify';
import { ExploreHeader } from "./ExploreHeader/page";
import { PostCard } from "./PostCard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Post } from "@/types/post";
import { usePosts } from "@/hooks/usePosts";
import dynamic from 'next/dynamic';

const Skeleton = dynamic(() => import("./skeleton/page"), {
  loading: () => <div>Loading Skeleton...</div>,
  ssr: false,
});

const SearchComponent = dynamic(() => import("./SearchComp/page"), {
  loading: () => <div>Searching...</div>,
  ssr: false,
});

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
  const [fetchQuery, setFetchQuery] = useState(false);
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  // New function to fetch search results
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) return;

    try {
      setSearchLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      console.log(data);
      setSearchResults(data.posts || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearch = useMemo(() =>
    debounce((query: string) => {
      console.log("Search query:", query);
      const sanitizedQuery = DOMPurify.sanitize(query);
      setSearchQuery(sanitizedQuery);
      setFetchQuery(true);
      fetchSearchResults(sanitizedQuery);
    }, 500),
    [/* no dependencies needed for fetchSearchResults */]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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

  const handleBackClick = () => {
    setFetchQuery(false);
    setSearchQuery("");
    setSearchResults([]);
  }

  return (
    <div className="sm:w-3/5 w-full mx-auto py-6 px-4 md:py-8 md:px-6">
      <ExploreHeader
        isVisible={isVisible}
        searchQuery={searchQuery}
        hasSearched={fetchQuery}
        onSearchChange={(query) => handleSearchChange(query)}
        onSearch={(e) => {
          e.preventDefault();
          handleSearch(searchQuery);
        }}
        trendingTopics={trendingTopics}
      />

      {fetchQuery === true ?
        <div>
          <SearchComponent
            query={searchQuery}
            onBack={handleBackClick}
            results={searchResults}
            isLoading={searchLoading}
          />
        </div>
        :
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
        </div>}

      {loading && <Skeleton />}
    </div>
  );
}