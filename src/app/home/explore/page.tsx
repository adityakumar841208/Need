"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAppSelector } from '@/store/hooks';
import { debounce } from 'lodash';
import DOMPurify from 'dompurify';
import { ExploreHeader } from "./ExploreHeader/page";
import { PostCard } from "./PostCard/page";
import { useRouter } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import dynamic from 'next/dynamic';
import FilterOption from './FilterOption/page';

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

  // Read user profile (may contain location.coordinates: [lng, lat])
  const profile = useAppSelector((state) =>
    (state as unknown as { profile?: { location?: { coordinates?: number[] } } }).profile
  );

  const [searchQuery, setSearchQuery] = useState("");
  // No activeCategory state for now (kept minimal)
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [fetchQuery, setFetchQuery] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<Record<string, unknown>>>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filters, setFilters] = useState<Record<string, unknown>>({ type: 'all' });

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
        setIsVisible(() =>
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
  const fetchSearchResults = useCallback(async (query: string, opts?: Record<string, unknown>) => {
    if (!query.trim()) return;
    // Read coordinates from Redux (profile.location.coordinates is [lng, lat])
    const coords = profile?.location?.coordinates;
    const lng = coords && coords.length === 2 ? coords[0] : undefined;
    const lat = coords && coords.length === 2 ? coords[1] : undefined;

    try {
      setSearchLoading(true);

      const params = new URLSearchParams();
      params.set('q', query);
      params.set('page', '1');
  // allow overrides from opts (coming from SearchComponent filters)
  const mergedFilters = { ...(filters || {}), ...(opts || {}) } as Record<string, unknown>;
  const selectedType = (mergedFilters?.type as string) || 'all';
      if (selectedType && selectedType !== 'all') params.set('type', selectedType);
  if (typeof mergedFilters.maxPrice === 'number') params.set('maxPrice', String(mergedFilters.maxPrice));
  if (typeof mergedFilters.sortBy === 'string') params.set('sortBy', String(mergedFilters.sortBy));
      if (lat !== undefined && lng !== undefined) {
        params.set('lat', String(lat));
        params.set('lng', String(lng));
      }
      // category filter omitted for now (can be added later)

      const response = await fetch(`/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('Search request failed');

      const data = await response.json();
      console.log('Search results:', data);
      // API returns providers in `providers` field
      // merge providers/posts/customers into a simple list for display (providers first)
      const combined: Array<Record<string, unknown>> = [];
      if (data.providers) combined.push(...(data.providers as unknown as Array<Record<string, unknown>>));
      if (data.posts) combined.push(...(data.posts as unknown as Array<Record<string, unknown>>));
      if (data.customers) combined.push(...(data.customers as unknown as Array<Record<string, unknown>>));
  setSearchResults(combined);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [profile, filters]);

  const handleSearch = useMemo(() =>
    debounce((query: string) => {
      console.log("Search query:", query);
      const sanitizedQuery = DOMPurify.sanitize(query);
      setSearchQuery(sanitizedQuery);
      setFetchQuery(true);
      fetchSearchResults(sanitizedQuery);
    }, 500),
    [fetchSearchResults]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

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
        onFiltersChange={(f) => setFilters(f)}
      />

      {/* Page-level FilterOption (keeps filters centralized) */}

      {fetchQuery === true ?
        <div>
          <SearchComponent
            query={searchQuery}
            onBack={handleBackClick}
            results={searchResults}
            isLoading={searchLoading}
            onFiltersChange={(f) => {
              // persist filters locally and re-run search with them
              setFilters((prev) => ({ ...(prev || {}), ...(f || {}) }));
              // call fetch with same query and new filters
              fetchSearchResults(searchQuery, f as Record<string, unknown>);
            }}
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