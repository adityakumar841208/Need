import { Search, Zap, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import FilterOption from "../FilterOption/page"

interface ExploreHeaderProps {
  isVisible: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  hasSearched?: boolean;
  trendingTopics: string[];
}

export function ExploreHeader({
  isVisible,
  searchQuery,
  onSearchChange,
  onSearch,
  hasSearched,
  trendingTopics
}: ExploreHeaderProps) {

  const changeFilter = (filters: any) => {
    // Handle filter changes here
    console.log("Filters changed:", filters);
  };
  return (
    <div className={`mb-8 space-y-6 ${isVisible ? 'sticky -my-5 border top-16 z-30' : '-my-5'} bg-background/95 rounded-lg p-4`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Explore Services
        </h1>

        <form onSubmit={onSearch} className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for services or providers..."
            className="pl-10 pr-4 bg-muted/40"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </form>
      </div>

      <div className="transition-all duration-300 ease-in-out min-h-[60px] md:block">
        {!hasSearched ? (
          <>
            <p className="text-sm font-medium mb-2 text-muted-foreground">Trending:</p>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
                  onClick={() => onSearchChange(topic)}
                >
                  <Zap className="w-3 h-3 mr-1 text-blue-500" />
                  {topic}
                </Badge>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center mb-2">
              <Filter className="w-4 h-4 mr-1 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Filters:</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterOption onFiltersChange={changeFilter} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}