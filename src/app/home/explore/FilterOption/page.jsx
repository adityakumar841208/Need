'use client';

import { useState } from "react";
import { ChevronDown, Filter, X, SlidersHorizontal } from "lucide-react";
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
  categories = ["Design", "Development", "Marketing", "Writing", "Admin"],
  locations = ["Remote", "Local", "Hybrid"],
  maxPrice = 1000
}) {
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    location: initialFilters.location || "",
    priceRange: initialFilters.priceRange || [0, maxPrice],
    rating: initialFilters.rating || "",
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
      rating: "",
    };
    updateFilters(clearedFilters);
  };

  // Render filter badges and popover filters
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Category filters as badges */}
        {categories.map((category) => (
          <Badge
            key={category}
            variant={filters.categories.includes(category) ? "default" : "outline"}
            className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}

        {/* Location filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant={filters.location ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              {filters.location || "Location"} {filters.location && <X className="w-3 h-3 ml-1" onClick={(e) => { e.stopPropagation(); updateFilters({...filters, location: ""}) }} />}
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

        {/* Price Range filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant={filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              Price
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">Price range:</label>
              <div className="flex justify-between">
                <span className="text-xs">${filters.priceRange[0]}</span>
                <span className="text-xs">${filters.priceRange[1]}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Rating filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant={filters.rating ? "default" : "outline"}
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              {filters.rating || "Rating"}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <div className="space-y-2">
              <label className="text-xs font-medium">Minimum rating:</label>
              <div className="flex flex-col gap-2">
                {['4+ stars', '3+ stars', '2+ stars', '1+ stars'].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? "default" : "outline"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => updateFilters({ ...filters, rating: filters.rating === rating ? "" : rating })}
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* More filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-muted px-3 py-1 text-xs"
            >
              <SlidersHorizontal className="w-3 h-3 mr-1" />
              More
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-60 p-3">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Additional Filters</h4>
              {/* Add more filter options here */}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear all button */}
        {(filters.categories.length > 0 || filters.location || filters.rating || 
         (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice)) && (
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