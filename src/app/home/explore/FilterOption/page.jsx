'use client';

import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterOption({
  onFiltersChange,
  initialFilters = {},
  categories = ["Design", "Development ", "Marketing", "Writing", "Admin"],
  locations = ["Remote", "Local", "Hybrid"],
  maxPrice = 1000
}) {
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    location: initialFilters.location || "",
    maxPrice: typeof initialFilters.maxPrice === 'number' ? initialFilters.maxPrice : null,
    priceRange: initialFilters.priceRange || [0, maxPrice],
    // keep a simple `type` field: all | provider | post | customer
    type: initialFilters.type || 'all',
    ...initialFilters
  });

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Helper functions
  const handleCategoryChange = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];

    updateFilters({ ...filters, categories: newCategories });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      location: "",
      priceRange: [0, maxPrice],
      maxPrice: null,
      // reset type to all
      type: 'all',
    };
    updateFilters(clearedFilters);
  };

  // Render filter badges and popover filters
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category filters as badges */}

        {/* Type selector badges */}
        {['all', 'provider', 'post', 'customer'].map(t => (
          <Badge
            key={t}
            variant={filters.type === t ? "default" : "outline"}
            className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            onClick={() => updateFilters({ ...filters, type: t })}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </Badge>
        ))}

        {/* Location filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant={filters.location ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              {filters.location || "Location"} {filters.location && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); updateFilters({ ...filters, location: "" }) }} />}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <Select
              value={filters.location || "all"}
              onValueChange={(value) => updateFilters({ ...filters, location: value === "all" ? "" : value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>

        {/* Max price filter (simple) */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant={typeof filters.maxPrice === 'number' ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              Price
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">Max price</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="any"
                  value={filters.maxPrice ?? ''}
                  onChange={(e) => updateFilters({ ...filters, maxPrice: e.target.value === '' ? null : Number(e.target.value) })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* (Removed rating and more to keep filters focused) */}

        {/* Clear all button */}
        {(filters.categories.length > 0 || filters.location || typeof filters.maxPrice === 'number' || filters.type !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}