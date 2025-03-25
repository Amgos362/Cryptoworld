import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface SearchFilterProps {
  onSearch?: (term: string) => void;
  onFilter?: (filters: FilterOptions) => void;
}

interface FilterOptions {
  marketCapRange: [number, number];
  priceChangeRange: [number, number];
  showOnlyFavorites: boolean;
}

const SearchFilter = ({
  onSearch = () => {},
  onFilter = () => {},
}: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    marketCapRange: [0, 100],
    priceChangeRange: [-100, 100],
    showOnlyFavorites: false,
  });
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilter(updatedFilters);

    // Update active filters badges
    const newActiveFilters: string[] = [];
    if (
      updatedFilters.marketCapRange[0] > 0 ||
      updatedFilters.marketCapRange[1] < 100
    ) {
      newActiveFilters.push("Market Cap");
    }
    if (
      updatedFilters.priceChangeRange[0] > -100 ||
      updatedFilters.priceChangeRange[1] < 100
    ) {
      newActiveFilters.push("Price Change");
    }
    if (updatedFilters.showOnlyFavorites) {
      newActiveFilters.push("Favorites");
    }
    setActiveFilters(newActiveFilters);
  };

  const clearFilter = (filter: string) => {
    const newActiveFilters = activeFilters.filter((f) => f !== filter);
    setActiveFilters(newActiveFilters);

    if (filter === "Market Cap") {
      handleFilterChange({ marketCapRange: [0, 100] });
    } else if (filter === "Price Change") {
      handleFilterChange({ priceChangeRange: [-100, 100] });
    } else if (filter === "Favorites") {
      handleFilterChange({ showOnlyFavorites: false });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    handleFilterChange({
      marketCapRange: [0, 100],
      priceChangeRange: [-100, 100],
      showOnlyFavorites: false,
    });
  };

  return (
    <div className="w-full bg-gray-900 p-4 border-b border-gray-800">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            className="pl-10 bg-gray-800 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white p-4">
              <div className="space-y-4">
                <h3 className="font-medium">Market Cap Range</h3>
                <Slider
                  defaultValue={filters.marketCapRange}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleFilterChange({
                      marketCapRange: value as [number, number],
                    })
                  }
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${filters.marketCapRange[0]}M</span>
                  <span>${filters.marketCapRange[1]}B+</span>
                </div>

                <Separator className="my-4 bg-gray-700" />

                <h3 className="font-medium">Price Change (%)</h3>
                <Slider
                  defaultValue={filters.priceChangeRange}
                  min={-100}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    handleFilterChange({
                      priceChangeRange: value as [number, number],
                    })
                  }
                  className="my-6"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{filters.priceChangeRange[0]}%</span>
                  <span>{filters.priceChangeRange[1]}%</span>
                </div>

                <Separator className="my-4 bg-gray-700" />

                <div className="flex items-center justify-between">
                  <label
                    htmlFor="favorites"
                    className="font-medium cursor-pointer"
                  >
                    Show only favorites
                  </label>
                  <input
                    id="favorites"
                    type="checkbox"
                    checked={filters.showOnlyFavorites}
                    onChange={(e) =>
                      handleFilterChange({
                        showOnlyFavorites: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-blue-500"
                  />
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search
          </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {activeFilters.map((filter) => (
            <Badge
              key={filter}
              variant="secondary"
              className="bg-gray-800 text-gray-200 flex items-center gap-1"
            >
              {filter}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => clearFilter(filter)}
              />
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-gray-400 hover:text-white hover:bg-transparent"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
